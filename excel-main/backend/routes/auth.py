from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import UserCreate, UserLogin, UserResponse, User
from utils.auth import hash_password, verify_password, create_access_token, get_current_user
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_auth_router(db: AsyncIOMotorDatabase):
    
    @router.post("/register")
    async def register(user_data: UserCreate):
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role="user"
        )
        
        user_dict = user.model_dump()
        user_dict['created_at'] = user_dict['created_at'].isoformat()
        user_dict['updated_at'] = user_dict['updated_at'].isoformat()
        
        await db.users.insert_one(user_dict)
        
        # Create token
        token = create_access_token({"user_id": user.id, "email": user.email, "role": user.role})
        
        return {
            "message": "User registered successfully",
            "token": token,
            "user": UserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                is_blocked=user.is_blocked,
                created_at=user.created_at
            )
        }
    
    @router.post("/login")
    async def login(credentials: UserLogin):
        # Find user
        user_doc = await db.users.find_one({"email": credentials.email})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if user is blocked
        if user_doc.get("is_blocked", False):
            raise HTTPException(status_code=403, detail="Account has been blocked. Contact administrator.")
        
        # Verify password
        if not verify_password(credentials.password, user_doc["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        token = create_access_token({
            "user_id": user_doc["id"],
            "email": user_doc["email"],
            "role": user_doc["role"]
        })
        
        return {
            "message": "Login successful",
            "token": token,
            "user": UserResponse(
                id=user_doc["id"],
                name=user_doc["name"],
                email=user_doc["email"],
                role=user_doc["role"],
                is_blocked=user_doc.get("is_blocked", False),
                created_at=user_doc["created_at"]
            )
        }
    
    @router.get("/me")
    async def get_current_user_info(current_user: dict = Depends(get_current_user)):
        user_doc = await db.users.find_one({"id": current_user["user_id"]})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user_doc.get("is_blocked", False):
            raise HTTPException(status_code=403, detail="Account has been blocked")
        
        return UserResponse(
            id=user_doc["id"],
            name=user_doc["name"],
            email=user_doc["email"],
            role=user_doc["role"],
            is_blocked=user_doc.get("is_blocked", False),
            created_at=user_doc["created_at"]
        )
    
    return router
