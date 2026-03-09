# backend/services/tools_service.py
# Business tool prompts — each function returns a specialized prompt
# that instructs the AI on how to handle a specific task type.

def get_email_generation_prompt(context: str) -> str:
    """Returns a prompt for generating professional business emails."""
    return f"""You are a professional business email writer. Generate a complete, 
polished business email based on the following request:

{context}

Format the email with:
- Subject line
- Professional greeting
- Clear body with logical structure
- Professional closing
- Signature placeholder

Tone: Professional, clear, concise. No filler language."""


def get_company_research_prompt(company_name: str) -> str:
    """Returns a prompt for structured company research."""
    return f"""Provide a structured business intelligence report on: {company_name}

Include:
1. Company Overview (industry, size, founded)
2. Core Products/Services
3. Business Model
4. Key Competitors
5. Recent News or Developments (if known)
6. Potential Opportunities or Risks

Format as a clean business report. Note if any information is uncertain."""


def get_pdf_summary_prompt(pdf_text: str) -> str:
    """Returns a prompt for PDF summarization."""
    return f"""Analyze the following document and provide a structured summary:

{pdf_text}

Your summary must include:
1. Executive Summary (2-3 sentences)
2. Key Points (bullet list)
3. Important Data or Figures
4. Conclusions or Recommendations
5. Action Items (if applicable)"""


def get_csv_analysis_prompt(csv_summary: str, user_question: str = "") -> str:
    """Returns a prompt for CSV data analysis."""
    question_section = f"\nSpecific question to answer: {user_question}" if user_question else ""
    
    return f"""You are a senior data analyst. Analyze the following dataset summary and provide business insights:

{csv_summary}
{question_section}

Provide:
1. Dataset Overview
2. Key Trends and Patterns
3. Notable Anomalies or Outliers
4. Business Insights and Recommendations
5. Suggested Next Steps

Use clear, professional language. Format with headers."""