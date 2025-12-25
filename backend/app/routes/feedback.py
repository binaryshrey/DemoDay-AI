from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from ..deps import get_supabase, get_embedding_model
from ..services.rag_service import retrieve_contexts
from ..services.feedback_service import generate_feedback

router = APIRouter(prefix="/pitch", tags=["pitch"])

class FeedbackReq(BaseModel):
    pitch_text: str = Field(..., min_length=20)
    top_k: int = Field(6, ge=1, le=20)
    # optional: include live Q&A transcript later
    qa_transcript: Optional[List[Dict[str, Any]]] = None

@router.post("/feedback")
def pitch_feedback(req: FeedbackReq):
    rag = retrieve_contexts(
        supabase=get_supabase(),
        embedding_model=get_embedding_model(),
        query=req.pitch_text,
        top_k=req.top_k,
        filter_video_id=None,
    )
    return generate_feedback(pitch_text=req.pitch_text, contexts=rag["contexts"], qa_transcript=req.qa_transcript)
