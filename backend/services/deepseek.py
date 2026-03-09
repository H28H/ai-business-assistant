# backend/services/deepseek.py
# This module handles all communication with the DeepSeek AI API.
# It is the only file in the project that talks directly to DeepSeek.
# All other parts of the app call functions from this file.

import httpx
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL_NAME = os.getenv("MODEL_NAME", "deepseek-chat")

# This is the system prompt — it defines the AI's personality and capabilities.
# It is sent at the start of every conversation, invisible to the user.
SYSTEM_PROMPT = """You are an AI Business Automation Assistant — a professional-grade 
AI tool built to help businesses work smarter. You specialize in:

- Summarizing documents and extracting key insights
- Analyzing business data from spreadsheets
- Drafting professional business emails
- Researching companies and market intelligence
- Automating repetitive business workflows

You communicate clearly and professionally. When you receive data (from a PDF or CSV), 
you provide structured, actionable insights. You always ask clarifying questions 
when a request is ambiguous. You behave like a senior business analyst who happens 
to have full AI capabilities."""


async def chat_with_deepseek(messages: list, system_prompt: str = SYSTEM_PROMPT) -> str:
    """
    Send a conversation to DeepSeek and return the AI's response.
    
    Args:
        messages: Full conversation history as a list of {role, content} dicts
        system_prompt: Instructions that define the AI's behavior
    
    Returns:
        The AI's text response as a string
    """
    
    # Build the full message list with system prompt at the start
    full_messages = [
        {"role": "system", "content": system_prompt}
    ] + messages
    
    # Make the API request
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{DEEPSEEK_BASE_URL}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL_NAME,
                "messages": full_messages,
                "temperature": 0.7,      # 0 = deterministic, 1 = creative
                "max_tokens": 2000,       # Maximum response length
                "stream": False
            }
        )
        
        # Raise an error if the API returned a non-200 status
        response.raise_for_status()
        
        data = response.json()
        return data["choices"][0]["message"]["content"]