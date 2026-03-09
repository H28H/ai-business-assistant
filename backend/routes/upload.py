# backend/routes/upload.py
# Handles file uploads (PDF and CSV).
# When a file is uploaded, it:
# 1. Saves the file temporarily
# 2. Extracts/processes its content
# 3. Returns a summary to the frontend
# 4. Cleans up the temporary file

from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.pdf_service import extract_text_from_pdf
from backend.services.csv_service import analyze_csv
from backend.services.deepseek import chat_with_deepseek
from backend.services.tools_service import get_pdf_summary_prompt, get_csv_analysis_prompt
from backend.utils.file_handler import save_upload, cleanup_file

router = APIRouter()


@router.post("/upload/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and summarize a PDF file."""
    
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    file_path = None
    try:
        # Save file temporarily
        file_path = await save_upload(file)
        
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(file_path)
        
        # Build prompt and get AI summary
        prompt = get_pdf_summary_prompt(pdf_text)
        messages = [{"role": "user", "content": prompt}]
        summary = await chat_with_deepseek(messages)
        
        return {
            "success": True,
            "filename": file.filename,
            "summary": summary,
            "message": f"PDF '{file.filename}' has been analyzed."
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Always clean up the file, even if an error occurred
        if file_path:
            cleanup_file(file_path)


@router.post("/upload/csv")
async def upload_csv(file: UploadFile = File(...), question: str = ""):
    """Upload and analyze a CSV file."""
    
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    file_path = None
    try:
        file_path = await save_upload(file)
        
        # Generate structured summary from CSV
        csv_summary = analyze_csv(file_path)
        
        # Get AI analysis
        prompt = get_csv_analysis_prompt(csv_summary, question)
        messages = [{"role": "user", "content": prompt}]
        analysis = await chat_with_deepseek(messages)
        
        return {
            "success": True,
            "filename": file.filename,
            "analysis": analysis,
            "message": f"CSV '{file.filename}' has been analyzed."
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if file_path:
            cleanup_file(file_path)