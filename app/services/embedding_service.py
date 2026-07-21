"""
embedding_service.py — Gemini API embeddings (models/text-embedding-004).
Switched from local sentence-transformers to Gemini API to avoid OOM on
Render free tier (512 MB RAM). Gemini embeddings are free-tier-compatible
and produce 768-dim vectors.
"""
import logging
from typing import List, Dict, Any

import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

_EMBED_MODEL = "models/text-embedding-004"
_VECTOR_DIM = 768  # Gemini text-embedding-004 output dimension


def _configure_genai() -> None:
    """Configure the Gemini client once (idempotent)."""
    genai.configure(api_key=settings.gemini_api_key)


def embed_text(text: str) -> List[float]:
    """Embed a single string and return the float vector."""
    _configure_genai()
    result = genai.embed_content(
        model=_EMBED_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def embed_query(text: str) -> List[float]:
    """Embed a query string (uses retrieval_query task type for better recall)."""
    _configure_genai()
    result = genai.embed_content(
        model=_EMBED_MODEL,
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]


def embed_chunks(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Add an 'embedding' key to each chunk dict.
    Embeds one chunk at a time to stay within Gemini free-tier rate limits.
    Returns the same list with embeddings attached.
    """
    _configure_genai()
    result = []
    for chunk in chunks:
        enriched = dict(chunk)
        enriched["embedding"] = embed_text(chunk["text"])
        result.append(enriched)
    return result
