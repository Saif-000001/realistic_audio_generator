from typing import List
from sqlalchemy.orm import Session
from app.models.conversion import Conversion
from app.schemas.conversion import ConversionCreate, ConversionUpdate
from app.crud.base import CRUDBase

class CRUDConversion(CRUDBase[Conversion, ConversionCreate, ConversionUpdate]):
    """CRUD operations for conversions."""
    def create_with_owner(
    self, db: Session, *, obj_in: dict, user_id: int, audio_file_path: str
    ) -> Conversion:
        """Create a new conversion with owner."""
        db_obj = Conversion(
            **obj_in,
            user_id=user_id,
            audio_file_path=audio_file_path
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_multi_by_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Conversion]:
        """Get conversions by owner."""
        return (
            db.query(Conversion)
            .filter(Conversion.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
conversion = CRUDConversion(Conversion)