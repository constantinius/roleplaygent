from langgraph.prebuilt import function_tool

from ..types import Player
from ..utils import create_new_player

@function_tool
def create_player(
    name: str,
    description: str,
    appearance: str,
    personality: str,
    backstory: str,
    goals: str,
) -> Player:
    """Create a new player with the given attributes."""
    return create_new_player(
        name=name,
        description=description,
        appearance=appearance,
        personality=personality,
        backstory=backstory,
        goals=goals,
    ) 