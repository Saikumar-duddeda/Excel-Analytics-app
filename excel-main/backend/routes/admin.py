from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from utils.auth import require_admin
from models.user import UserResponse
from datetime import datetime, timezone

router = APIRouter(prefix="/admin", tags=["Admin"])

def get_admin_router(db: AsyncIOMotorDatabase):
    
    @router.get("/stats")
    async def get_platform_stats(current_user: dict = Depends(require_admin)):
        total_users = await db.users.count_documents({})
        total_uploads = await db.uploads.count_documents({})
        total_admins = await db.users.count_documents({"role": "admin"})
        total_blocked_users = await db.users.count_documents({"is_blocked": True})
        
        return {
            "total_users": total_users,
            "total_uploads": total_uploads,
            "total_admins": total_admins,
            "total_blocked_users": total_blocked_users
        }
    
    @router.get("/users", response_model=list[UserResponse])
    async def list_all_users(current_user: dict = Depends(require_admin)):
        users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
        return [UserResponse(**user) for user in users]
    
    @router.patch("/users/{user_id}/block")
    async def block_user(user_id: str, current_user: dict = Depends(require_admin)):
        # Prevent self-blocking
        if user_id == current_user["user_id"]:
            raise HTTPException(status_code=400, detail="Cannot block yourself")
        
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_blocked": True, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        return {"message": "User blocked successfully"}
    
    @router.patch("/users/{user_id}/unblock")
    async def unblock_user(user_id: str, current_user: dict = Depends(require_admin)):
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"is_blocked": False, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        return {"message": "User unblocked successfully"}
    
    @router.delete("/users/{user_id}")
    async def delete_user(user_id: str, current_user: dict = Depends(require_admin)):
        # Prevent self-deletion
        if user_id == current_user["user_id"]:
            raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user's uploads
        await db.uploads.delete_many({"user_id": user_id})
        
        # Delete user
        await db.users.delete_one({"id": user_id})
        
        return {"message": "User and associated data deleted successfully"}
    
    return router
