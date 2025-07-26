import os
from typing import List
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.api.dependencies import get_conversion_by_id
from app.core.auth import get_current_active_user
from app.crud.conversion import conversion
from app.crud.conversion import conversion as conversion_crud
from app.database import get_db
from app.models.user import User
from app.schemas.conversion import Conversion, TextToSpeechRequest
from app.services.ocr_service import pdf_to_text, image_to_text
from app.services.tts_service import text_to_audio
from app.config import UPLOAD_DIR
router = APIRouter()

@router.post("/pdf", response_model=Conversion, status_code=status.HTTP_201_CREATED)
async def convert_pdf_to_audio(
    file: UploadFile = File(...),
    language: str = Form("en"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Convert a PDF file to audio with optional language selection."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    file_path = UPLOAD_DIR / file.filename
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        full_text, lang = await pdf_to_text(file_path, language)
        audio_file_path = await text_to_audio(full_text, lang)
        conv = conversion.create_with_owner(
            db=db,
            obj_in={
                "file_name": file.filename,
                "language": lang,
                "source_type": "pdf",
                "text_content": full_text
            },
            user_id=current_user.id,
            audio_file_path=str(audio_file_path)
        )
        return conv
    except Exception as e:
        raise HTTPException(500, detail=f"Error in conversion process: {str(e)}")
    finally:
        if file_path.exists():
            os.unlink(file_path)


@router.post("/image", response_model=Conversion, status_code=status.HTTP_201_CREATED)
async def convert_image_to_audio(
    file: UploadFile = File(...),
    language: str = Form("en"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Convert an image file to audio with optional language selection."""
    allowed_exts = (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp")
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(400, detail=f"Only image files {', '.join(allowed_exts)} are accepted")
    file_path = UPLOAD_DIR / file.filename
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        text, lang = await image_to_text(file_path, language)
        if not text:
            raise HTTPException(422, detail="Could not extract text from the image")
        audio_file_path = await text_to_audio(text, lang)
        conv = conversion.create_with_owner(
            db=db,
            obj_in={
                "file_name": file.filename,
                "language": lang,
                "source_type": "image",
                "text_content": text
            },
            user_id=current_user.id,
            audio_file_path=str(audio_file_path)
        )
        return conv
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, detail=f"Error in conversion process: {str(e)}")
    finally:
        if file_path.exists():
            os.unlink(file_path)

@router.post("/text", response_model=Conversion, status_code=status.HTTP_201_CREATED)
async def convert_text_to_audio(
    request: TextToSpeechRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Convert text to audio."""
    try:
        # Generate audio from text
        audio_file_path = await text_to_audio(request.text, request.language)
        # Create conversion record
        conv = conversion.create_with_owner(
            db=db,
            obj_in={
                "file_name": f"text_input_{audio_file_path.stem}",
                "language": request.language,
                "source_type": "text",
                "text_content": request.text
            },
            user_id=current_user.id,
            audio_file_path=str(audio_file_path)
        )
        return conv
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error in conversion process: {str(e)}"
        )

@router.get("", response_model=List[Conversion])
def list_conversions(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all conversions for the current user."""
    return conversion.get_multi_by_owner(
        db, user_id=current_user.id, skip=skip, limit=limit
    )

@router.get("/{conversion_id}", response_model=Conversion)
def get_conversion(
    conversion: Conversion = Depends(get_conversion_by_id)
):
    """Get a specific conversion."""
    return conversion

@router.get("/{conversion_id}/download")
def download_audio(
    conversion: Conversion = Depends(get_conversion_by_id),
    inline: bool = False 
):
    """Download or stream the audio file for a conversion."""
    file_path = Path(conversion.audio_file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    # Determine media type based on file extension
    media_type = "audio/wav"  # default
    if file_path.suffix.lower() == ".mp3":
        media_type = "audio/mpeg"
    elif file_path.suffix.lower() == ".ogg":
        media_type = "audio/ogg"
    elif file_path.suffix.lower() == ".m4a":
        media_type = "audio/mp4"
    # Generate a clean filename
    clean_filename = f"{conversion.file_name}_{conversion.id}{file_path.suffix}"
    return FileResponse(
        file_path,
        media_type=media_type,
        filename=clean_filename,
        # Use inline for streaming in browser, attachment for download
        headers={"Content-Disposition": f"{'inline' if inline else 'attachment'}; filename={clean_filename}"}
    )

@router.get("/{conversion_id}/stream")
def stream_audio(
    conversion: Conversion = Depends(get_conversion_by_id)
):
    """Stream audio file for web players."""
    file_path = Path(conversion.audio_file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audio file not found"
        )
    # Determine media type
    media_type = "audio/wav"
    if file_path.suffix.lower() == ".mp3":
        media_type = "audio/mpeg"
    elif file_path.suffix.lower() == ".ogg":
        media_type = "audio/ogg"
    elif file_path.suffix.lower() == ".m4a":
        media_type = "audio/mp4"
    return FileResponse(
        file_path,
        media_type=media_type,
        headers={
            "Content-Disposition": "inline",
            "Accept-Ranges": "bytes",  # Enable range requests for better streaming
            "Cache-Control": "public, max-age=3600"  # Cache for 1 hour
        }
    )

@router.delete("/{conversion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversion(
    conversion: Conversion = Depends(get_conversion_by_id),
    db: Session = Depends(get_db)
):
    """Delete a conversion and its audio file."""
    # Delete audio file
    file_path = Path(conversion.audio_file_path)
    if file_path.exists():
        os.unlink(file_path)
    # Delete conversion record
    conversion_crud.remove(db, id=conversion.id)
    return None