from functools import wraps
from traceback import print_exception
import json

from agents import function_tool, RunContextWrapper

from ..types import GameState, Adventure, Player
from .. import utils


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

# @function_tool
# @logged_tool
# def create_game(adventure: Adventure, player: Player) -> GameState:
#     """Create a new game state."""
#     return utils.create_new_game(adventure, player)


@function_tool
@logged_tool
def create_game(adventure_json: str, player_json: str) -> str:
    """Create a new game state from JSON strings representing the adventure and player."""
    try:
        adventure = Adventure.model_validate_json(adventure_json)
        player = Player.model_validate_json(player_json)
        game_state = utils.create_new_game(adventure, player)

        utils.save_game(game_state)
        return game_state.id
    except Exception as e:
        print(f"Error creating game: {e}")
        raise e
    
