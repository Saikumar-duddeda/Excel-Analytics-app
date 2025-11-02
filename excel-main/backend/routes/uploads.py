from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Body
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.upload import Upload, UploadResponse, SaveChartConfigRequest, ChartConfig
from utils.auth import get_current_user
from utils.excel_parser import parse_excel_file
from utils.ai_summary import generate_ai_summary
from utils.pdf_generator import generate_chart_pdf
import os
import uuid
from datetime import datetime, timezone
import io

router = APIRouter(prefix="/uploads", tags=["Uploads"])

UPLOADS_DIR = os.environ.get("UPLOADS_DIR", "/app/backend/uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

def get_uploads_router(db: AsyncIOMotorDatabase):
    
    @router.post("", response_model=UploadResponse)
    async def upload_excel_file(
        file: UploadFile = File(...),
        current_user: dict = Depends(get_current_user)
    ):
        # Validate file type
        if not file.filename.endswith(('.xls', '.xlsx')):
            raise HTTPException(status_code=400, detail="Only .xls and .xlsx files are supported")
        
        # Validate file size (20MB limit)
        content = await file.read()
        if len(content) > 20 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 20MB limit")
        
        # Save file
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        saved_filename = f"{file_id}{file_extension}"
        file_path = os.path.join(UPLOADS_DIR, saved_filename)
        
        with open(file_path, 'wb') as f:
            f.write(content)
        
        # Parse Excel file
        try:
            columns, row_count = parse_excel_file(file_path)
        except Exception as e:
            os.remove(file_path)
            raise HTTPException(status_code=400, detail=f"Failed to parse Excel file: {str(e)}")
        
        # Create upload document
        upload = Upload(
            user_id=current_user["user_id"],
            filename=saved_filename,
            original_filename=file.filename,
            file_size=len(content),
            columns=[col.model_dump() for col in columns],
            row_count=row_count
        )
        
        upload_dict = upload.model_dump()
        upload_dict['created_at'] = upload_dict['created_at'].isoformat()
        upload_dict['updated_at'] = upload_dict['updated_at'].isoformat()
        
        await db.uploads.insert_one(upload_dict)
        
        return UploadResponse(**upload.model_dump())
    
    @router.get("", response_model=list[UploadResponse])
    async def get_user_uploads(current_user: dict = Depends(get_current_user)):
        uploads = await db.uploads.find(
            {"user_id": current_user["user_id"]},
            {"_id": 0}
        ).sort("created_at", -1).to_list(100)
        
        return [UploadResponse(**upload) for upload in uploads]
    
    @router.get("/{upload_id}", response_model=UploadResponse)
    async def get_upload(upload_id: str, current_user: dict = Depends(get_current_user)):
        upload = await db.uploads.find_one(
            {"id": upload_id, "user_id": current_user["user_id"]},
            {"_id": 0}
        )
        
        if not upload:
            raise HTTPException(status_code=404, detail="Upload not found")
        
        return UploadResponse(**upload)
    
    @router.post("/{upload_id}/config")
    async def save_chart_config(
        upload_id: str,
        config_data: SaveChartConfigRequest,
        current_user: dict = Depends(get_current_user)
    ):
        upload = await db.uploads.find_one(
            {"id": upload_id, "user_id": current_user["user_id"]},
            {"_id": 0}
        )
        
        if not upload:
            raise HTTPException(status_code=404, detail="Upload not found")
        
        # Create new chart config
        chart_config = ChartConfig(
            x_axis=config_data.x_axis,
            y_axis=config_data.y_axis,
            chart_type=config_data.chart_type,
            title=config_data.title
        )
        
        # Update chart configs
        chart_configs = upload.get("chart_configs", [])
        chart_configs.append(chart_config.model_dump())
        
        update_data = {
            "chart_configs": chart_configs,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Generate AI summary if requested and not already generated
        if config_data.generate_ai_summary and not upload.get("ai_summary"):
            from models.upload import ColumnData
            columns = [ColumnData(**col) for col in upload["columns"]]
            ai_summary = await generate_ai_summary(columns, config_data.x_axis, config_data.y_axis)
            update_data["ai_summary"] = ai_summary
        
        await db.uploads.update_one(
            {"id": upload_id},
            {"$set": update_data}
        )
        
        return {
            "message": "Chart configuration saved successfully",
            "ai_summary": update_data.get("ai_summary")
        }
    
    @router.post("/{upload_id}/download/pdf")
    async def download_chart_pdf(
        upload_id: str,
        image_data: dict = Body(...),
        current_user: dict = Depends(get_current_user)
    ):
        upload = await db.uploads.find_one(
            {"id": upload_id, "user_id": current_user["user_id"]},
            {"_id": 0}
        )
        
        if not upload:
            raise HTTPException(status_code=404, detail="Upload not found")
        
        try:
            image_data_url = image_data.get("image")
            title = image_data.get("title", "Chart")
            
            pdf_bytes = generate_chart_pdf(image_data_url, title)
            
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={title.replace(' ', '_')}.pdf"}
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
    
    return router
