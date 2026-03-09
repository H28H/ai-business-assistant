# backend/utils/file_handler.py
# Handles saving uploaded files to disk and cleaning up after processing.

import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "uploads"

def ensure_upload_dir():
    """Create the uploads directory if it doesn't exist."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_upload(file: UploadFile) -> str:
    """
    Save an uploaded file to disk with a unique filename.
    Returns the file path.
    """
    ensure_upload_dir()
    
    # Generate a unique filename to avoid collisions
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Write file to disk
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return file_path


def cleanup_file(file_path: str):
    """Delete a file after processing to keep storage clean."""
    if os.path.exists(file_path):
        os.remove(file_path)