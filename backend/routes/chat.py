# backend/routes/chat.py
# Handles the /api/chat endpoint — the core conversation route.
# Receives messages from the frontend and returns AI responses.

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.services.deepseek import chat_with_deepseek

router = APIRouter()


# Pydantic models define what data we expect to receive
class Message(BaseModel):
    role: str      # "user" or "assistant"
    content: str   # The message text


class ChatRequest(BaseModel):
    messages: List[Message]   # Full conversation history


class ChatResponse(BaseModel):
    response: str
    success: bool


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Receives the full conversation history and returns the AI's next response.
    """
    try:
        # Convert Pydantic models to plain dicts for the DeepSeek service
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        
        # Get response from DeepSeek
        response_text = await chat_with_deepseek(messages)
        
        return ChatResponse(response=response_text, success=True)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")