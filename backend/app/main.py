from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

from app.routes.pitch_sessions import router as pitch_sessions_router
from app.routes.rag import router as rag_router
from app.routes.feedback import router as feedback_router

app = FastAPI(title="DemoDay AI Backend", version="0.1.0")

app.include_router(pitch_sessions_router)
app.include_router(rag_router)
app.include_router(feedback_router)

@app.get("/health")
def health():
    return {"ok": True}
