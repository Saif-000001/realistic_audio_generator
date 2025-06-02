# Use Python 3.12.3 slim image for smaller size
FROM python:3.12.3-slim

# Set environment variables for better Python behavior
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

# Set working directory
WORKDIR /app

# Install system dependencies if needed (for audio processing, PDF handling, etc.)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    tesseract-ocr \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy environment file and application code
COPY .env .
COPY . .

# Create necessary directories
RUN mkdir -p uploads temp output

# Set default environment variables (can be overridden by .env file)
ENV APP_NAME="PDF/Image to Audio Converter" \
    APP_VERSION="1.0.0" \
    DEBUG=false \
    ENVIRONMENT="development" \
    SECRET_KEY="your-super-secret-key-replace-in-production-with-strong-random-key" \
    ALGORITHM="HS256" \
    ACCESS_TOKEN_EXPIRE_MINUTES=30 \
    DATABASE_URL="sqlite:///./app.db" \
    ALLOWED_ORIGINS="http://localhost:3000"

# Expose the port
EXPOSE 8000


# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]