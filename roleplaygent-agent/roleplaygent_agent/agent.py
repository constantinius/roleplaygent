import os
from agents import Agent, Runner

from .agents.game_master import agent as game_master_agent

async def run_agent(prompt: str):
    result = await Runner.run(game_master_agent, prompt)
    return result.final_output