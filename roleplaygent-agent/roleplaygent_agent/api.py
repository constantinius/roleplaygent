from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .agent import run_agent  # your custom agent logic

app = FastAPI()

# Allow calls from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-site.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/agent")
async def run_agent_api(req: PromptRequest):
    response = await run_agent(req.prompt)
    return {"response": response}