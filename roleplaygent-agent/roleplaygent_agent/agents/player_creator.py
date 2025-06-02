from agents import Agent

from ..types import Player


system_prompt = """
You are a player creator for a roleplaying game. You are responsible for creating players for players to play in.

Create a player from the given input.
"""

agent = Agent(
    name="Player Creator",
    instructions=system_prompt,
    output_type=Player,
    model="gpt-4o-mini"
)
