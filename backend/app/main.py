from fastapi import FastAPI
from .routes.rag import router as rag_router
from .routes.feedback import router as feedback_router

app = FastAPI(title="DemoDay AI Backend", version="0.1.0")
app.include_router(rag_router)
app.include_router(feedback_router)

@app.get("/health")
def health():
    return {"alive": True}
