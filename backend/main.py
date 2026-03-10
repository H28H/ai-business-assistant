# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import os

from backend.routes.chat import router as chat_router
from backend.routes.upload import router as upload_router
from backend.routes.tools import router as tools_router

app = FastAPI(
    title="AI Business Automation Assistant",
    description="Production-ready AI assistant for business automation workflows",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(tools_router, prefix="/api")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "success": False}
    )

# Serve React build
dist_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')

if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(
        directory=os.path.join(dist_path, 'assets')), name="assets")

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "AI Business Automation Assistant"}

    @app.get("/")
    async def serve_react():
        return FileResponse(os.path.join(dist_path, 'index.html'))

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        return FileResponse(os.path.join(dist_path, 'index.html'))
else:
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "AI Business Automation Assistant"}