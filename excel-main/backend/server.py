from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from routes.auth import get_auth_router
from routes.uploads import get_uploads_router
from routes.admin import get_admin_router
from utils.auth import hash_password, needs_rehash
from datetime import datetime, timezone
import uuid
import uvicorn

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Excel Analytics Platform")

# Create API router
api_router = APIRouter(prefix="/api")

# Health check
@api_router.get("/")
async def root():
    return {"message": "Excel Analytics Platform API", "status": "running"}

# Include routers
api_router.include_router(get_auth_router(db))
api_router.include_router(get_uploads_router(db))
api_router.include_router(get_admin_router(db))

# Include API router in main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event - seed admin user
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Excel Analytics Platform...")
    
    # Create uploads directory
    uploads_dir = os.environ.get("UPLOADS_DIR", "/app/backend/uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    logger.info(f"Uploads directory: {uploads_dir}")
    
    # Seed admin user if not exists
    admin_email = os.environ.get("ADMIN_EMAIL", "adminbro@gmail.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing_admin = await db.users.find_one({"email": admin_email})

    if not existing_admin:
        admin_user = {
            "id": str(uuid.uuid4()),
            "name": "Admin",
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "role": "admin",
            "is_blocked": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info(f"Admin user created: {admin_email}")
    else:
        # Check if password needs rehashing (e.g., from bcrypt to pbkdf2)
        try:
            if needs_rehash(existing_admin["password_hash"]):
                logger.info(f"Rehashing password for existing admin: {admin_email}")
                await db.users.update_one(
                    {"email": admin_email},
                    {"$set": {"password_hash": hash_password(admin_password)}}
                )
        except Exception as e:
            logger.warning(f"Could not check if password needs rehashing: {e}. Rehashing anyway.")
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}}
            )
        logger.info(f"Admin user already exists: {admin_email}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Application shutdown complete")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
