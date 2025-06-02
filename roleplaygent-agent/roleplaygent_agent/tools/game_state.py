from pathlib import Path
from typing import Optional, List
from functools import wraps
from traceback import print_exception

from agents import function_tool, RunContextWrapper

from ..types import GameState
from .. import utils

GAMES_DIR = Path("games")


def logged_tool(func):
    @wraps(func)
    def wrapper(ctx, *args, **kwargs):
        print(
            f"[{func.__name__}] Calling {func.__name__} with args: {args} and kwargs: {kwargs}"
        )
        try:
            result = func(ctx, *args, **kwargs)
            print(f"[{func.__name__}] Result: {result}")
            return result
        except Exception as e:
            print(f"[{func.__name__}] Error: {e}")
            print_exception(e)
            raise e

    return wrapper


# @function_tool
# @logged_tool
# def add_scene_log(wrapper: RunContextWrapper[GameState], action: str, result: str) -> None:
#     """Add an entry to the scene log."""
#     utils.add_log_entry(wrapper.context, action, result)


# @function_tool
# @logged_tool
# def next_scene(wrapper: RunContextWrapper[GameState], game_state: GameState) -> bool:
#     """Advance to the next scene, resetting scene counter."""
#     return utils.advance_scene(game_state)


# @function_tool
# @logged_tool
# def next_chapter(wrapper: RunContextWrapper[GameState], game_state: GameState) -> bool:
#     """Advance to the next chapter, resetting chapter and scene counters."""
#     return utils.advance_chapter(game_state)


# @function_tool
# @logged_tool
# def next_act(wrapper: RunContextWrapper[GameState], game_state: GameState) -> bool:
#     """Advance to the next act, resetting act, chapter and scene counters."""
#     return utils.advance_act(game_state)


@function_tool
@logged_tool
def close_scene(wrapper: RunContextWrapper[GameState]) -> None:
    """Advance to the next scene, resetting scene counter."""
    wrapper.context.advance_scene()




# @function_tool
# @logged_tool
# def close_chapter(wrapper: RunContextWrapper[GameState], game_id: str) -> Optional[GameState]:
#     """Advance to the next chapter, resetting chapter and scene counters."""
#     print(f"[close_chapter] Attempting to close chapter for game {game_id}")
#     game_state = utils.load_game(game_id)
#     if not game_state:
#         return None

#     current_act = game_state.adventure.acts[game_state.current_scene.act]

#     # Check if we can advance to next chapter
#     if game_state.current_scene.chapter + 1 < len(current_act.chapters):
#         print(
#             f"[close_chapter] Advancing to next chapter: {game_state.current_scene.chapter + 1}"
#         )
#         game_state.current_scene.chapter += 1
#         game_state.current_scene.scene = 0
#     else:
#         print(f"[close_chapter] No more chapters in act, advancing to next act")
#         return close_act(game_id)

#     utils.save_game(game_state)
#     return game_state


# @function_tool
# @logged_tool
# def close_act(wrapper: RunContextWrapper[GameState], game_id: str) -> Optional[GameState]:
#     """Advance to the next act, resetting act, chapter and scene counters."""
#     print(f"[close_act] Attempting to close act for game {game_id}")
#     game_state = utils.load_game(game_id)
#     if not game_state:
#         return None

#     # Check if we can advance to next act
#     if game_state.current_scene.act + 1 < len(game_state.adventure.acts):
#         print(f"[close_act] Advancing to next act: {game_state.current_scene.act + 1}")
#         game_state.current_scene.act += 1
#         game_state.current_scene.chapter = 0
#         game_state.current_scene.scene = 0
#     else:
#         print(f"[close_act] No more acts, closing adventure")
#         return close_adventure(game_id)

#     utils.save_game(game_state)
#     return game_state


# @function_tool
# @logged_tool
# def close_adventure(wrapper: RunContextWrapper[GameState], game_id: str) -> Optional[GameState]:
#     """Close the adventure by marking it as not running."""
#     print(f"[close_adventure] Closing adventure for game {game_id}")
#     game_state = utils.load_game(game_id)
#     if not game_state:
#         return None

#     game_state.is_running = False
#     print(f"[close_adventure] Marked adventure as not running")
#     utils.save_game(game_state)
#     return game_state


@function_tool
@logged_tool
def get_player_info(wrapper: RunContextWrapper[GameState]) -> str:
    """Get the player description."""
    player = wrapper.context.player
    return f"""
    Name: {player.name}
    Description: {player.description}
    Appearance: {player.appearance}
    Personality: {player.personality}
    Backstory: {player.backstory}
    Goals: {player.goals}
    Attributes:
    - Health: {player.health}
    - Strength: {player.strength}
    - Agility: {player.agility}
    - Intelligence: {player.intelligence}
    - Charisma: {player.charisma}
    - Endurance: {player.endurance}
    """


@function_tool
@logged_tool
def get_story(wrapper: RunContextWrapper[GameState]) -> str:
    """Get the story history up to the current point, including scene descriptions and log entries."""
    return utils.collect_story_history(wrapper.context)


@function_tool
@logged_tool
def get_next_challenge(wrapper: RunContextWrapper[GameState]) -> str | None:
    """Get the challenges for the current scene."""
    if wrapper.context.current_scene.challenges:
        return wrapper.context.current_scene.challenges[0]
    else:
        return None


@function_tool
@logged_tool
def close_next_challenge(wrapper: RunContextWrapper[GameState]) -> None:
    """Close a challenge."""
    try:
        wrapper.context.current_scene.challenges.pop(0)
    except IndexError:
        return None


@function_tool
@logged_tool
def get_current_goal(wrapper: RunContextWrapper[GameState]) -> str:
    """Load a game state from a JSON file."""
    return wrapper.context.get_current_adventure_scene().goal


@function_tool
@logged_tool
def add_log_entry(wrapper: RunContextWrapper[GameState], message: str) -> None:
    """Add a log entry to the game state."""
    wrapper.context.add_log_entry(message)


tools = [
    add_log_entry,
    close_scene,
    get_story,
    get_current_goal
]
