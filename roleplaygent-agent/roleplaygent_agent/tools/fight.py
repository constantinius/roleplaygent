from pathlib import Path
from typing import Optional, List
from functools import wraps
from traceback import print_exception

from agents import function_tool, RunContextWrapper

from ..types import GameState, Enemy, Player
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


@function_tool
@logged_tool
def deal_damage(wrapper: RunContextWrapper[GameState], name: str, damage: int) -> None:
    """Deal damage to an enemy."""
    game_state = wrapper.context
    for enemy in game_state.current_scene.enemies:
        if enemy.name == name:
            enemy.health -= damage
            return
    raise ValueError(f"Enemy {name} not found")

tools = [deal_damage]