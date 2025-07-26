from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ConversionBase(BaseModel):
    file_name: Optional[str] = None
    language: Optional[str] = None
    source_type: str = Field(..., description="Type of source: 'pdf', 'image', or 'text'")
    text_content: Optional[str] = None

class ConversionCreate(ConversionBase):
    pass

class ConversionUpdate(BaseModel):
    file_name: Optional[str] = None
    language: Optional[str] = None

class ConversionInDBBase(ConversionBase):
    id: int
    user_id: int
    audio_file_path: str
    created_at: datetime
    class Config:
        from_attributes = True

class Conversion(ConversionInDBBase):
    pass

class ConversionInDB(ConversionInDBBase):
    pass

class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "en"
    speaker: Optional[str] = None
