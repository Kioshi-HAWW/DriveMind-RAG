"""
embedding_service.py — Local sentence-transformers embeddings.
Model: all-MiniLM-L6-v2 (~80 MB, fits on Render free tier).
No API key required — runs entirely in-process.
"""
import logging
from typing import List, Dict, Any

from sentence_transformers import SentenceTransformer

from app.core.config import settings

logger = logging.getLogger(__name__)

# Loaded once at module import; reused across all requests
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info("Loading embedding model '%s' ...", settings.embedding_model_name)
        _model = SentenceTransformer(settings.embedding_model_name)
        logger.info("Embedding model loaded.")
    return _model


def embed_text(text: str) -> List[float]:
    """Embed a single string and return the float vector."""
    model = _get_model()
    vector = model.encode(text, convert_to_numpy=True).tolist()
    return vector


def embed_chunks(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Add an 'embedding' key to each chunk dict (in-place copy).
    Returns the same list with embeddings attached.
    """
    model = _get_model()
    texts = [c["text"] for c in chunks]
    vectors = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)

    result = []
    for chunk, vec in zip(chunks, vectors):
        enriched = dict(chunk)
        enriched["embedding"] = vec.tolist()
        result.append(enriched)

    return result
