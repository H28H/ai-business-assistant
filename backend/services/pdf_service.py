# backend/services/pdf_service.py
# Extracts text from uploaded PDF files.

import PyPDF2


def extract_text_from_pdf(file_path: str) -> str:
    """
    Read a PDF file and extract all text content.
    Returns the extracted text as a string.
    """
    text_content = []
    
    with open(file_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        
        # Loop through each page and extract text
        for page_num, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text_content.append(f"--- Page {page_num + 1} ---\n{page_text}")
    
    if not text_content:
        return "No readable text found in this PDF. It may be a scanned image."
    
    full_text = "\n\n".join(text_content)
    
    # Truncate if too long (API has token limits)
    # 8000 characters ≈ 2000 tokens — safe limit for DeepSeek
    if len(full_text) > 8000:
        full_text = full_text[:8000] + "\n\n[Document truncated for processing...]"
    
    return full_text