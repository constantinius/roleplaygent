import random
import json
import os
from pathlib import Path
from typing import Optional
from functools import wraps
from traceback import print_exception

from agents import function_tool

from ..types import Adventure, GameState, Player, CurrentScene, LogEntry
from .. import utils

GAMES_DIR = Path("games")


def logged_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(
            f"[{func.__name__}] Calling {func.__name__} with args: {args} and kwargs: {kwargs}"
        )
        try:
            result = func(*args, **kwargs)
            print(f"[{func.__name__}] Result: {result}")
            return result
        except Exception as e:
            print(f"[{func.__name__}] Error: {e}")
            print_exception(e)
            raise e

    return wrapper


@function_tool
@logged_tool
def create_game(adventure: Adventure, player: Player) -> GameState:
    """Create a new game state."""
    return utils.create_new_game(adventure, player)


def _load(game_id: str) -> Optional[GameState]:
    """Load a game state from a JSON file."""
    print(f"[load] Attempting to load game {game_id}")
    game_file = GAMES_DIR / f"{game_id}.json"
    if not game_file.exists():
        print(f"[load] Game file not found: {game_file}")
        return None

    with open(game_file, "r") as f:
        data = json.load(f)
        game_state = GameState.model_validate(data)
        print(
            f"[load] Successfully loaded game state for adventure: {game_state.adventure.title}"
        )
        return game_state


@function_tool
@logged_tool
def load(game_id: str) -> Optional[GameState]:
    """Load a game state from a JSON file."""
    return _load(game_id)


def _save_game(game_state: GameState) -> None:
    """Save a game state to a JSON file."""
    game_file = GAMES_DIR / f"{game_state.id}.json"
    print(f"[_save_game] Saving game state to {game_file}")
    with open(game_file, "w") as f:
        json.dump(game_state.model_dump(), f, indent=2)


@function_tool
@logged_tool
def add_scene_log(game_state: GameState, action: str, result: str) -> None:
    """Add an entry to the scene log."""
    utils.add_log_entry(game_state, action, result)


@function_tool
@logged_tool
def close_scene(game_id: str) -> Optional[GameState]:
    """Advance to the next scene, resetting scene counter."""
    print(f"[close_scene] Attempting to close scene for game {game_id}")
    game_state = utils.load_game(game_id)
    if not game_state:
        return None

    current_act = game_state.adventure.acts[game_state.current_scene.act]
    current_chapter = current_act.chapters[game_state.current_scene.chapter]

    # Check if we can advance to next scene
    if game_state.current_scene.scene + 1 < len(current_chapter.scenes):
        print(f"[close_scene] Advancing to next scene: {game_state.current_scene.scene + 1}")
        game_state.current_scene.scene += 1
    else:
        print(f"[close_scene] No more scenes in chapter, advancing to next chapter")
        return close_chapter(game_id)

    utils.save_game(game_state)
    return game_state


@function_tool
@logged_tool
def close_chapter(game_id: str) -> Optional[GameState]:
    """Advance to the next chapter, resetting chapter and scene counters."""
    print(f"[close_chapter] Attempting to close chapter for game {game_id}")
    game_state = utils.load_game(game_id)
    if not game_state:
        return None

    current_act = game_state.adventure.acts[game_state.current_scene.act]

    # Check if we can advance to next chapter
    if game_state.current_scene.chapter + 1 < len(current_act.chapters):
        print(
            f"[close_chapter] Advancing to next chapter: {game_state.current_scene.chapter + 1}"
        )
        game_state.current_scene.chapter += 1
        game_state.current_scene.scene = 0
    else:
        print(f"[close_chapter] No more chapters in act, advancing to next act")
        return close_act(game_id)

    utils.save_game(game_state)
    return game_state


@function_tool
@logged_tool
def close_act(game_id: str) -> Optional[GameState]:
    """Advance to the next act, resetting act, chapter and scene counters."""
    print(f"[close_act] Attempting to close act for game {game_id}")
    game_state = utils.load_game(game_id)
    if not game_state:
        return None

    # Check if we can advance to next act
    if game_state.current_scene.act + 1 < len(game_state.adventure.acts):
        print(f"[close_act] Advancing to next act: {game_state.current_scene.act + 1}")
        game_state.current_scene.act += 1
        game_state.current_scene.chapter = 0
        game_state.current_scene.scene = 0
    else:
        print(f"[close_act] No more acts, closing adventure")
        return close_adventure(game_id)

    utils.save_game(game_state)
    return game_state


@function_tool
@logged_tool
def close_adventure(game_id: str) -> Optional[GameState]:
    """Close the adventure by marking it as not running."""
    print(f"[close_adventure] Closing adventure for game {game_id}")
    game_state = utils.load_game(game_id)
    if not game_state:
        return None

    game_state.is_running = False
    print(f"[close_adventure] Marked adventure as not running")
    utils.save_game(game_state)
    return game_state


@function_tool
@logged_tool
def create_player(
    name: str,
    description: str,
    appearance: str,
    personality: str,
    backstory: str,
    goals: str,
) -> Player:
    """
    Create a new player with the given attributes.

    The player will have 10 points to distribute among the attributes.
    The attributes are strength, agility, intelligence, charisma, and endurance.
    The player will have a random inventory of items.
    """
    print(f"[create_player] Creating new player: {name}")
    stats = [0, 0, 0, 0, 0]
    for _ in range(10):
        stats[random.randint(0, len(stats) - 1)] += 1

    strength, agility, intelligence, charisma, endurance = stats
    print(
        f"[create_player] Generated stats - STR: {strength}, AGI: {agility}, INT: {intelligence}, CHA: {charisma}, END: {endurance}"
    )

    return Player(
        name=name,
        description="description",
        appearance="appearance",
        personality="personality",
        backstory="backstory",
        goals="goals",
        strength=strength,
        agility=agility,
        intelligence=intelligence,
        charisma=charisma,
        endurance=endurance,
        inventory=[],
    )


def list_running_games() -> list[GameState]:
    """List all currently running games."""
    print("[list_running_games] Listing all running games")
    running_games = []
    
    # Ensure games directory exists
    GAMES_DIR.mkdir(exist_ok=True)
    
    # Iterate through all game files
    for game_file in GAMES_DIR.glob("*.json"):
        try:
            with open(game_file, "r") as f:
                data = json.load(f)
                game_state = GameState.model_validate(data)
                if game_state.is_running:
                    running_games.append(game_state)
                    print(f"[list_running_games] Found running game: {game_state.id} - {game_state.adventure.title}")
        except Exception as e:
            print(f"[list_running_games] Error loading game {game_file}: {e}")
            continue
    
    print(f"[list_running_games] Found {len(running_games)} running games")
    return running_games


@function_tool
@logged_tool
def get_story(game_state: GameState) -> str:
    """Get the story history up to the current point, including scene descriptions and log entries."""
    return utils.collect_story_history(game_state)


tools = [
    create_game,
    load,
    add_scene_log,
    close_scene,
    close_chapter,
    close_act,
    close_adventure,
    get_story,
]
