# Realistic Audio Generator

A full-stack web application for authenticated users to upload documents or images, extract text using OCR (Optical Character Recognition), and convert text to speech (TTS). Built with **FastAPI** for the backend and **React + Vite** for the frontend.

## 🚀 Features

- 🔐 User authentication (JWT-based)
- 📄 OCR support for PDFs and images
- 🗣️ Text-to-speech conversion and secure audio download
- 🧾 Conversion history per user
- 📦 Dockerized for production-ready deployment
- 🌐 CORS-enabled API for frontend/backend integration

---
## Clone the repository
```
git clone https://github.com/Saif-000001/realistic_audio_generator.git
cd realistic_audio_generator
```

## 📁 Project Structure

```

project-root/
│
├── backend/
│   ├── app/
│   │   ├── api/               # Route handlers
│   │   |    ├── routes/  
│   │   |    └── dependencies.py             
│   │   ├── core/              # Security logic
│   │   ├── crud/              # Database queries
│   │   ├── database.py        # DB engine and session
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # OCR & TTS services
│   │   ├── config.py          # App configuration
│   │   └── main.py
│   ├── temp/
│   ├── Dockerfile
│   ├── .gitignore
│   ├── app.db
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   |       ├── Auth/
│   │   |       ├── Conversion/
│   │   |       └── Layout/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── RouterProvider/
│   │   └── Root/
│   ├── index.css
│   ├── main.jsx
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── .env
│   └── package.json
│
├── docker-compose.yml
└── README.md

````

---

## 🐳 Getting Started with Docker

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Run the full stack

```bash
docker-compose up --build
````

Access:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Backend: FastAPI

### Setup locally

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### API Documentation

FastAPI provides interactive Swagger docs at:

```
http://localhost:8000/docs
```

## 💻 Frontend: React + Vite + TailwindCSS

### Setup locally

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```
#### Live: https://realistics-audio-generator.netlify.app/
---


## 🔐 Authentication

* Uses JWT tokens
* Stored securely in localStorage
* Token is automatically attached to protected API requests

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
# Application Settings
APP_NAME="Realistic Audio Generator"
APP_VERSION="1.0.0"
DEBUG=false
ENVIRONMENT="development"

# Security Configuration
SECRET_KEY="your-super-secret-key-replace-in-production-with-strong-random-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Configuration
DATABASE_URL="sqlite:///./app.db"

# CORS Configuration
ALLOWED_ORIGINS="http://localhost:3000"
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:8000
```
---

Happy Coding! 🎯