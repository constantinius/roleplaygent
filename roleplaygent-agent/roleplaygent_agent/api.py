from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .agent import run_agent  # your custom agent logic
from .tools.game_state import list_running_games, _load
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

class CreateGameRequest(BaseModel):
    character: dict
    world: dict

@app.post("/api/agent")
async def run_agent_api(req: PromptRequest):
    response = await run_agent(req.prompt)
    return {"response": response}

@app.post("/api/games")
async def create_game(req: CreateGameRequest):
    try:
        # Create a prompt for the game master agent
        prompt = f"""Create a new adventure with the following character and world settings:

Character:
- Name: {req.character['name']}
- Race: {req.character['race']}
- Class: {req.character['class']}
- Description: {req.character['description']}

World:
- Setting: {req.world['setting']}
- Mature Themes: {req.world['matureThemes']}
- Description: {req.world['description']}

Please create an engaging adventure that fits these parameters."""
        
        # Call the game master agent to create the game
        response = await run_agent(prompt)
        return {"response": response}
    except Exception as e:
        import traceback
        traceback.print_exception(e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/games")
async def get_running_games():
    try:
        games = list_running_games()
        return games
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/games/{game_id}")
async def get_game(game_id: str):
    print(f"Loading game {game_id}")
    try:
        game = _load(game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return game
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))