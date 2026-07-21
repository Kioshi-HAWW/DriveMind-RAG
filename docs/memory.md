# MEMORY — Project State (MANDATORY READ FIRST)

> **Rule for every AI/assistant working on this project:**
> 1. Read this file FIRST, before touching any code.
> 2. Do not re-plan or re-decide things already decided in prd.md / arch.md
>    / rules.md unless the user explicitly asks to change them.
> 3. Resume work at exactly the "Current Position" below.
> 4. After completing any meaningful step, **update this file** — current
>    phase, what changed, what's next — before ending the session.
> 5. If something was decided differently than the other docs say (e.g.
>    swapped Qdrant for Pinecone), log it in "Deviations From Plan" and
>    update arch.md/rules.md too — don't let docs go stale.

---

## Current Position
- **Phase:** Phase 6 — Deploy to Render ✅ COMPLETE
- **Currently working file:** N/A
- **Last updated:** 2026-07-21
- **Last action taken:** Deployed Docker-based service to Render. `/health` returns `{"status":"ok"}`. Service live at https://drivemind-rag-1.onrender.com

## Next Step
- Run `POST /ingest` against the production URL to index Google Drive documents.
- Test `POST /chat` with a real query in production.
- (Optional Phase 7) Add UI, scheduled re-ingestion, rate limiting, basic auth.

## Decisions Locked In (do not re-litigate without user request)
- Backend: FastAPI (Python)
- **Budget: $0.** No paid API keys or paid plans anywhere in the stack.
- Vector store: **Qdrant Cloud free-forever tier** (NOT local Chroma —
  Render's free disk is ephemeral)
- Embeddings: **Local `sentence-transformers` (`all-MiniLM-L6-v2`)** —
  runs in-process, no API cost, no rate limit
- Chat/agent model: **Google Gemini API free tier**, hand-rolled tool-use
  loop via `google-generativeai` SDK (no LangChain agent framework)
- Drive auth: Google Service Account (not OAuth user flow) — free
- Hosting: **Render Free Web Service** — accept cold starts/sleep as a
  known trade-off; no free cron, so re-ingestion is a manual
  `POST /ingest` trigger, not scheduled

## Deviations From Plan
- **2026-07-19:** Original plan used Claude (Anthropic) for chat and
  OpenAI for embeddings — both paid. Switched to Gemini free tier (chat)
  + local sentence-transformers (embeddings) to hit the $0 requirement.
  User does have a "ChatGPT Go" subscription but confirmed that does NOT
  include API credits, so it can't substitute for a paid API here.

## Open Questions / Blockers
- None. Setup is fully verified and local test suite is passing.

## Session Log
| Date       | Phase touched | Summary                                      |
|------------|----------------|-----------------------------------------------|
| 2026-07-18 | Phase -1 (planning) | Created prd/arch/rules/phases/design/memory docs |
| 2026-07-19 | Phase -1 (planning) | Reworked stack to be fully free-tier (Gemini + local embeddings + Qdrant free + Render free); clarified ChatGPT Go has no API access |
| 2026-07-19 | Phase 0 (Setup) | Initialized repository, resolved gRPC dependency pin, configured local sentence-transformers embedding check, and verified passing tests. |
| 2026-07-21 | Phase 1 - 4 | Fixed Qdrant WriteTimeout with 60s timeout & 50-point batches. Successfully ingested Google Drive PDF (620 chunks). Verified end-to-end RAG tool search & Gemini generation with source citations. 8/8 unit tests passing. |
| 2026-07-21 | Phase 6 | Deployed to Render using Docker runtime. Fixed `grpcio` build (added gcc/build-essential). Fixed `$PORT` expansion via shell CMD. Added QDRANT_URL and GOOGLE_DRIVE_FOLDER_ID env vars. Service live at https://drivemind-rag-1.onrender.com — `/health` returns `{"status":"ok"}`. |


---
### Template for future entries (copy/paste and fill in when updating)
```
## Current Position
- **Phase:** 
- **Currently working file:** 
- **Last updated:** 
- **Last action taken:** 

## Next Step
- 

## Session Log (append a row)
| Date | Phase touched | Summary |
```
