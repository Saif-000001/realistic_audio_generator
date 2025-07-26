import os
import logging
from fastapi import FastAPI
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.api.routes import auth_router, users_router, convert_router
from app.config import ALLOWED_ORIGINS, APP_NAME
from app.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title=APP_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=f"/auth", tags=["authentication"])
app.include_router(users_router, prefix=f"/users", tags=["users"])
app.include_router(convert_router, prefix=f"/convert", tags=["conversions"])

# frontend_path = Path(__file__).resolve().parent.parent / "frontend" / "dist"
# app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

# @app.get("/")
# def serve_spa():
#     return FileResponse("frontend/dist/index.html")

# Add this for Render deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)