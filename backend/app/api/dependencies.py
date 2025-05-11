from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.conversion import Conversion
from app.core.auth import get_current_active_user
from app.crud.conversion import conversion


def get_conversion_by_id(
    conversion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Conversion:
    """Get a conversion by ID if it belongs to the current user."""
    conv = conversion.get(db, conversion_id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversion not found"
        )
    if conv.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return conv