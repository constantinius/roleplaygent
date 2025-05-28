from pydantic import BaseModel, Field
from uuid import uuid4
from datetime import datetime


class DetailedCharacter(BaseModel):
    name: str = Field(description="The name of the character")
    description: str = Field(description="A short description of the character")
    appearance: str = Field(description="The appearance of the character")
    personality: str = Field(description="The personality of the character")
    backstory: str = Field(description="The backstory of the character")
    goals: str = Field(description="The goals of the character")


Character = str | DetailedCharacter


class Attributes(BaseModel):
    strength: int = Field(description="The strength of the character")
    agility: int = Field(description="The agility of the character")
    intelligence: int = Field(description="The intelligence of the character")
    charisma: int = Field(description="The charisma of the character")
    endurance: int = Field(description="The luck of the character")


class Player(DetailedCharacter, Attributes):
    inventory: list[str] = Field(description="The inventory of the player")


class Scene(BaseModel):
    title: str = Field(description="The title of the scene")
    description: str = Field(description="A short description of the scene")
    goal: str = Field(description="The goal of the scene")
    characters: list[Character] = Field(description="The characters in the scene")
    encounter: bool = Field(description="Whether the scene is an encounter")
    enemies: list[str] = Field(description="The enemies in the scene")


class Chapter(BaseModel):
    title: str = Field(description="The title of the chapter")
    description: str = Field(description="A short description of the chapter")
    scenes: list[Scene] = Field(description="The scenes of the chapter")


class Act(BaseModel):
    title: str = Field(description="The title of the act")
    description: str = Field(description="A short description of the act")
    chapters: list[Chapter] = Field(description="The chapters of the act")


class Adventure(BaseModel):
    title: str = Field(description="The title of the adventure")
    description: str = Field(description="A short description of the adventure")
    characters: list[Character] = Field(description="The characters in the adventure")
    acts: list[Act] = Field(description="The acts of the adventure")


class CurrentScene(BaseModel):
    act: int = Field(description="The current act of the adventure", default=0)
    chapter: int = Field(description="The current chapter of the adventure", default=0)
    scene: int = Field(description="The current scene of the adventure", default=0)

    characters: list[Character] = Field(
        description="The characters in the scene", default_factory=list
    )
    enemies: list[str] = Field(
        description="The enemies in the scene", default_factory=list
    )


class LogEntry(BaseModel):
    timestamp: str = Field(
        description="The timestamp of the log entry", default_factory=lambda: datetime.now().isoformat()
    )
    action: str = Field(description="The players action.")
    result: str = Field(description="The results of the action.")
    act: int = Field(description="The act of the log entry", default=0)
    chapter: int = Field(description="The chapter of the log entry", default=0)
    scene: int = Field(description="The scene of the log entry", default=0)


class GameState(BaseModel):
    id: str = Field(
        description="The id of the game state", default_factory=lambda: str(uuid4())
    )
    adventure: Adventure = Field(
        description="The adventure that is being played in the world"
    )
    is_running: bool = Field(
        description="Whether the adventure is running", default=True
    )

    player: Player = Field(description="The player character")

    current_scene: CurrentScene = Field(
        description="The current scene of the adventure", default_factory=CurrentScene
    )

    log: list[LogEntry] = Field(
        description="The log of the adventure", default_factory=list
    )
