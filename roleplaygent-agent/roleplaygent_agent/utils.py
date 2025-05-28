import random
import json
import os
from pathlib import Path
from typing import Optional

from .types import Adventure, GameState, Player, CurrentScene, LogEntry

GAMES_DIR = Path("games")

def create_new_game(adventure: Adventure, player: Player) -> GameState:
    """Create a new game state."""
    print(f"[create_new_game] Creating new game with adventure: {adventure.title}")
    try:
        game_state = GameState(
            adventure=adventure,
            player=player,
            current_scene=CurrentScene(),
            is_running=True,
        )
    except Exception as e:
        print(f"[create_new_game] Error creating game state: {e}")
        raise e
    return game_state

def save_game(game_state: GameState) -> None:
    """Save a game state to a JSON file."""
    # Ensure games directory exists
    GAMES_DIR.mkdir(exist_ok=True)
    
    game_file = GAMES_DIR / f"{game_state.id}.json"
    print(f"[save_game] Saving game state to {game_file}")
    with open(game_file, "w") as f:
        json.dump(game_state.model_dump(), f, indent=2)

def load_game(game_id: str) -> Optional[GameState]:
    """Load a game state from a JSON file."""
    game_file = GAMES_DIR / f"{game_id}.json"
    if not game_file.exists():
        print(f"[load_game] Game file not found: {game_file}")
        return None

    print(f"[load_game] Loading game state from {game_file}")
    with open(game_file, "r") as f:
        data = json.load(f)
        return GameState.model_validate(data)

def add_log_entry(game_state: GameState, action: str, result: str) -> None:
    """Add an entry to the scene log."""
    log_entry = LogEntry(
        action=action,
        result=result,
        act=game_state.current_scene.act,
        chapter=game_state.current_scene.chapter,
        scene=game_state.current_scene.scene
    )
    print(f"[add_log_entry] Created log entry for act {log_entry.act}, chapter {log_entry.chapter}, scene {log_entry.scene}")
    game_state.log.append(log_entry)
    print(f"[add_log_entry] Added entry - Action: {action}, Result: {result}")

def advance_scene(game_state: GameState) -> bool:
    """Advance to the next scene, resetting scene counter."""
    current_act = game_state.adventure.acts[game_state.current_scene.act]
    current_chapter = current_act.chapters[game_state.current_scene.chapter]

    if game_state.current_scene.scene + 1 < len(current_chapter.scenes):
        print(f"[advance_scene] Advancing to next scene: {game_state.current_scene.scene + 1}")
        game_state.current_scene.scene += 1
        return True
    return False

def advance_chapter(game_state: GameState) -> bool:
    """Advance to the next chapter, resetting chapter and scene counters."""
    current_act = game_state.adventure.acts[game_state.current_scene.act]

    if game_state.current_scene.chapter + 1 < len(current_act.chapters):
        print(f"[advance_chapter] Advancing to next chapter: {game_state.current_scene.chapter + 1}")
        game_state.current_scene.chapter += 1
        game_state.current_scene.scene = 0
        return True
    return False

def advance_act(game_state: GameState) -> bool:
    """Advance to the next act, resetting act, chapter and scene counters."""
    if game_state.current_scene.act + 1 < len(game_state.adventure.acts):
        print(f"[advance_act] Advancing to next act: {game_state.current_scene.act + 1}")
        game_state.current_scene.act += 1
        game_state.current_scene.chapter = 0
        game_state.current_scene.scene = 0
        return True
    return False

def create_new_player(
    name: str,
    description: str,
    appearance: str,
    personality: str,
    backstory: str,
    goals: str,
) -> Player:
    """Create a new player with the given attributes."""
    print(f"[create_new_player] Creating new player: {name}")
    stats = [0, 0, 0, 0, 0]
    for _ in range(10):
        stats[random.randint(0, len(stats) - 1)] += 1

    strength, agility, intelligence, charisma, endurance = stats
    print(f"[create_new_player] Generated stats - STR: {strength}, AGI: {agility}, INT: {intelligence}, CHA: {charisma}, END: {endurance}")

    return Player(
        name=name,
        description=description,
        appearance=appearance,
        personality=personality,
        backstory=backstory,
        goals=goals,
        strength=strength,
        agility=agility,
        intelligence=intelligence,
        charisma=charisma,
        endurance=endurance,
        inventory=[],
    )

def collect_story_history(game_state: GameState) -> str:
    """Collect the story history up to the current point, including scene descriptions and log entries."""
    story = []
    
    # Add adventure title and description
    story.append(f"# {game_state.adventure.title}\n")
    story.append(f"{game_state.adventure.description}\n")
    
    # Add player information
    story.append(f"## Player: {game_state.player.name}\n")
    story.append(f"{game_state.player.description}\n")
    
    # Walk through all acts, chapters, and scenes up to current point
    for act_idx, act in enumerate(game_state.adventure.acts):
        if act_idx > game_state.current_scene.act:
            break
            
        story.append(f"\n## Act {act_idx + 1}: {act.title}\n")
        story.append(f"{act.description}\n")
        
        for chapter_idx, chapter in enumerate(act.chapters):
            if act_idx == game_state.current_scene.act and chapter_idx > game_state.current_scene.chapter:
                break
                
            story.append(f"\n### Chapter {chapter_idx + 1}: {chapter.title}\n")
            story.append(f"{chapter.description}\n")
            
            for scene_idx, scene in enumerate(chapter.scenes):
                if (act_idx == game_state.current_scene.act and 
                    chapter_idx == game_state.current_scene.chapter and 
                    scene_idx > game_state.current_scene.scene):
                    break
                    
                story.append(f"\n#### Scene {scene_idx + 1}: {scene.title}\n")
                story.append(f"{scene.description}\n")
                
                # Add relevant log entries for this scene
                scene_logs = [
                    log for log in game_state.log 
                    if (log.act == act_idx and 
                        log.chapter == chapter_idx and 
                        log.scene == scene_idx)
                ]
                
                if scene_logs:
                    story.append("\n**Scene Events:**\n")
                    for log in scene_logs:
                        story.append(f"- {log.action}\n")
                        story.append(f"  {log.result}\n")
    
    return "\n".join(story) 