from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_active_user
from app.crud.user import user
from app.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def read_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user info."""
    return current_user


@router.put("/me", response_model=UserSchema)
def update_current_user(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user info."""
    # Check if email is being updated and is already taken
    if user_in.email and user_in.email != current_user.email:
        db_user = user.get_by_email(db, email=user_in.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Check if username is being updated and is already taken
    if user_in.username and user_in.username != current_user.username:
        db_user = user.get_by_username(db, username=user_in.username)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Update user
    return user.update(db, db_obj=current_user, obj_in=user_in)