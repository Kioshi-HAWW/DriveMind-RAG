# Personal Library RAG Assistant

A Retrieval-Augmented Generation (RAG) system that answers questions from your personal
Google Drive document library using **100% free-tier services**.

## Stack (all $0)
| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| Embeddings | `sentence-transformers` — `all-MiniLM-L6-v2` (local, no API) |
| Vector Store | Qdrant Cloud — Free Forever tier |
| LLM / Agent | Google Gemini API — free tier |
| Drive Auth | Google Service Account |
| Hosting | Render Free Web Service |

## Quick Start (local)

```bash
# 1. Clone and create virtualenv
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and fill in your env vars
cp .env.example .env
# Edit .env with your real keys

# 4. Run the API
uvicorn app.main:app --reload

# 5. Trigger ingestion (separate terminal)
python scripts/ingest_drive.py
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |
| `POST` | `/ingest` | Trigger Drive sync + embedding |
| `POST` | `/chat` | Ask a question → get cited answer |

### Example chat request
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What does my book say about stoicism?"}'
```

## External Setup (one-time)

1. **Gemini API key** — [Google AI Studio](https://aistudio.google.com) → Get API Key (free, no card)
2. **Qdrant Cloud cluster** — [cloud.qdrant.io](https://cloud.qdrant.io) → Create Free Cluster (no card)
3. **Google Service Account** — Google Cloud Console → Create project → Enable Drive API → Create Service Account → Share your Drive folder with the service account email

See `.env.example` for all required variables.

## Project Docs
- [`docs/prd.md`](docs/prd.md) — Product requirements
- [`docs/arch.md`](docs/arch.md) — Architecture & tech stack
- [`docs/phases.md`](docs/phases.md) — Build plan
- [`docs/rules.md`](docs/rules.md) — Conventions & boundaries
- [`docs/design.md`](docs/design.md) — UI style guide
- [`docs/memory.md`](docs/memory.md) — Live project state (read this first)

## Running Tests
```bash
pytest tests/ -v
```
