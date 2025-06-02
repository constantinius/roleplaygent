from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .agent import run_agent, run_create_game_agent
from .utils import list_running_games, load_game
from .agents.game_master import agent as game_master_agent

import sentry_sdk


sentry_sdk.init(
    dsn="https://f144027da57c2fcfedd83ce4443bb57b@o4509089275772928.ingest.de.sentry.io/4509427898777680",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    # Set profile_session_sample_rate to 1.0 to profile 100%
    # of profile sessions.
    profile_session_sample_rate=1.0,
    # Set profile_lifecycle to "trace" to automatically
    # run the profiler on when there is an active transaction
    profile_lifecycle="trace",
)


app = FastAPI()

# Allow calls from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-site.vercel.app",
        "https://roleplaygent-ui.fly.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    message: str


class CreateGameRequest(BaseModel):
    character: dict
    world: dict


@app.post("/api/games")
async def create_game(req: CreateGameRequest):
    print(req)
    try:
        # Create a prompt for the game master agent
        prompt = f"""
Create a new adventure with the following character and world settings:

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
        game_state, initial = await run_create_game_agent(prompt, req.character)
        return {"id": game_state.id, "initial": initial}
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
        game = load_game(game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return game
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/games/{game_id}/agent")
async def agent_endpoint(game_id: str, prompt: PromptRequest):
    """Run the agent with the given message and game state context."""
    try:
        response = await run_agent(game_id, prompt=prompt.message)
        if response is None:
            raise HTTPException(status_code=404, detail="Game not found")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
