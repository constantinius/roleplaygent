from agents import Agent

from .adventure_generator import agent as adventure_generator_agent

from ..tools.create_game import create_game

agent = Agent(
    name="Create Game",

    instructions="""
    You are an export role playing game designer. 
    You have a tool to generate a story for the players to play in. Use it to create the planned story arc for this adventure.
    Use the output of that story and persist it by using the `create_game` tool.
    Respond only with the identifier of the created game.
    """,
    tools=[
        adventure_generator_agent.as_tool(None, None),
        create_game,
    ],
    model="gpt-4o-mini",
)
