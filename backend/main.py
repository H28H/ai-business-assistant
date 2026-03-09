# backend/main.py
# This is the entry point for the entire backend application.
# It creates the FastAPI app, registers all routes, and configures CORS.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from backend.routes.chat import router as chat_router
from backend.routes.upload import router as upload_router
from backend.routes.tools import router as tools_router

from fastapi import Request
from fastapi.responses import JSONResponse

# Create the FastAPI application
app = FastAPI(
    title="AI Business Automation Assistant",
    description="Production-ready AI assistant for business automation workflows",
    version="1.0.0"
)

# CORS middleware — allows the frontend to talk to the backend.
# Without this, browsers block cross-origin requests for security reasons.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # In production, replace with your actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules under the /api prefix
app.include_router(chat_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(tools_router, prefix="/api")

# Serve the frontend static files
# This lets FastAPI serve index.html directly
app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
async def serve_frontend():
    """Serve the main frontend page."""
    return FileResponse("frontend/index.html")


@app.get("/health")
async def health_check():
    """Health check endpoint — used by Render to verify the app is running."""
    return {"status": "healthy", "service": "AI Business Automation Assistant"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch any unhandled errors and return a clean JSON response."""
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "success": False}
    )