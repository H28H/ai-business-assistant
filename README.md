# AI Business Automation Assistant

> A production-ready AI-powered assistant designed to automate real business workflows — built as a demonstration of full-stack AI engineering.

🚀 **[Live Demo](https://your-app-name.onrender.com)** ← Update this after deployment

---

## What It Does

| Feature | Description |
|---|---|
| 💬 Intelligent Chat | Contextual AI conversations with full memory |
| 📄 PDF Analysis | Upload documents for instant structured summaries |
| 📊 CSV Insights | Upload spreadsheets for automated business analysis |
| ✉️ Email Generation | Describe an email and receive a polished draft |
| 🔍 Company Research | Get comprehensive company intelligence reports |

---

## Architecture
```
ai-business-assistant/
├── backend/                 # Python FastAPI server
│   ├── routes/              # API endpoint definitions
│   ├── services/            # Business logic and AI integration
│   └── utils/               # File handling utilities
├── frontend/                # HTML/CSS/JS chat interface
├── .env                     # Environment variables (not committed)
└── requirements.txt         # Python dependencies
```

**Key Design Decisions:**
- **Model-agnostic architecture** — The AI provider is isolated in `deepseek.py`. Switching models requires changing one file.
- **Service layer pattern** — Business logic is separated from route handling for maintainability and testability.
- **Stateless file processing** — Uploaded files are processed and deleted immediately. No persistent storage required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, Uvicorn |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| AI | DeepSeek API (deepseek-chat) |
| File Processing | PyPDF2, Pandas |
| Deployment | Render |

---

## Local Setup

### Prerequisites
- Python 3.11+
- A DeepSeek API key — [get one here](https://platform.deepseek.com)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-business-assistant.git
cd ai-business-assistant

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Open .env and add your DeepSeek API key

# Run the application
uvicorn backend.main:app --reload --port 8000
```

Open `http://localhost:8000`

---

## API Endpoints

Interactive docs available at `/docs` when running locally.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send chat messages |
| POST | `/api/upload/pdf` | Upload and analyze a PDF |
| POST | `/api/upload/csv` | Upload and analyze a CSV |
| POST | `/api/tools/email` | Generate a business email |
| POST | `/api/tools/research` | Research a company |
| GET | `/health` | Service health check |

---

## Deployment

Deployed on [Render](https://render.com).

Environment variables required on the platform:
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `MODEL_NAME`

---

## Author

Built by [HassanNader] — [LinkedIn](https://linkedin.com/in/hassannader) · [GitHub](https://github.com/H282H)