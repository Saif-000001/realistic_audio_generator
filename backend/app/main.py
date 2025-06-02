import logging
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

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

# Include routers with API versioning to match OAuth2 scheme
# app.include_router(auth_router, prefix="/api/v1/auth", tags=["authentication"])
# app.include_router(users_router, prefix="/api/v1/users", tags=["users"])
# app.include_router(convert_router, prefix="/api/v1/convert", tags=["conversions"])

# @app.get("/", response_class=HTMLResponse)
# def root():
#     return open("../frontend/dist/index.html", "r").read()