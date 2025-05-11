from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Conversion(Base):
    __tablename__ = "conversions"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, index=True)
    language = Column(String)
    source_type = Column(String)  # "pdf", "image", or "text"
    text_content = Column(Text, nullable=True)  # If user directly inputs text
    audio_file_path = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    owner = relationship("User", back_populates="conversions")