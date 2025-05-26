import os
from agents import Agent, Runner

from .tools.dice import roll_dice


agent = Agent(
    name="Game Master",
    instructions="You are the game master for a roleplaying game. You are responsible for setting the scene, creating the characters, and running the game.",
    tools=[roll_dice]
)

async def run_agent(prompt):
    result = await Runner.run(agent, prompt)
    return result.final_output