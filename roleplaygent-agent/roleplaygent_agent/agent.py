from agents import Runner
from typing import Optional, List

from .agents.game_master import agent as game_master_agent
from .agents.adventure_generator import agent as adventure_generator_agent
from .agents.player_creator import agent as player_creator_agent
from .utils import load_game, save_game
from .types import GameState, Player


async def run_agent(game_id: str, prompt: str) -> Optional[str]:
    game_state = load_game(game_id)
    if not game_state:
        return None
    result = await Runner.run(game_master_agent, input=prompt, context=game_state)

    game_state.add_history_entry(prompt, result.final_output)

    save_game(game_state)

    return result.final_output


async def run_create_game_agent(prompt: str, character: dict) -> Optional[str]:
    adventure = (await Runner.run(adventure_generator_agent, input=prompt)).final_output

    print(adventure)

    player = Player(
        name=character.get("name", ""),
        description=character.get("description", ""),
        appearance=character.get("appearance", ""),
        personality=character.get("personality", ""),
        backstory=character.get("backstory", ""),
        goals=character.get("goals", ""),
        health=100,
        strength=5,
        agility=5,
        intelligence=5,
        charisma=5,
        endurance=5,
        inventory=[],
    )
    game_state = GameState(adventure=adventure, player=player)
    save_game(game_state)
    return await run_agent(game_state.id, "Start the story")
