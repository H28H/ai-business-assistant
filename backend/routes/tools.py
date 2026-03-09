# backend/routes/tools.py
# Dedicated endpoints for business tools:
# email generation and company research.

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.deepseek import chat_with_deepseek
from backend.services.tools_service import get_email_generation_prompt, get_company_research_prompt

router = APIRouter()


class EmailRequest(BaseModel):
    context: str   # User's description of the email they need


class ResearchRequest(BaseModel):
    company_name: str


@router.post("/tools/email")
async def generate_email(request: EmailRequest):
    """Generate a professional business email."""
    try:
        prompt = get_email_generation_prompt(request.context)
        messages = [{"role": "user", "content": prompt}]
        email_content = await chat_with_deepseek(messages)
        
        return {"success": True, "email": email_content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tools/research")
async def research_company(request: ResearchRequest):
    """Research a company and return a structured report."""
    try:
        prompt = get_company_research_prompt(request.company_name)
        messages = [{"role": "user", "content": prompt}]
        research = await chat_with_deepseek(messages)
        
        return {"success": True, "research": research}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))