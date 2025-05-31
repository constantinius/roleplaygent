export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface PageParams {
  id: string;
}

export interface Attributes {
  health: number;
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  endurance: number;
}

export interface Character extends Attributes {
  name: string;
  description: string;
  appearance: string;
  personality: string;
  backstory: string;
  goals: string;
}

export interface Enemy extends Attributes {
  name: string;
}

export interface Player extends Character {
  inventory: string[];
}

export interface Scene {
  title: string;
  description: string;
  goal: string;
  characters: string[];
  encounter: boolean;
  enemies: Enemy[];
  challenges: string[];
}

export interface Chapter {
  title: string;
  description: string;
  scenes: Scene[];
}

export interface Act {
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface Adventure {
  title: string;
  description: string;
  characters: Character[];
  acts: Act[];
}

export interface CurrentScene {
  act: number;
  chapter: number;
  scene: number;
  characters: (string | Character)[];
  enemies: Enemy[];
  challenges: string[];
}

export interface HistoryEntry {
  timestamp: string;
  prompt: string;
  result: string;
  act: number;
  chapter: number;
  scene: number;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  act: number;
  chapter: number;
  scene: number;
}

export interface GameState {
  id: string;
  adventure: Adventure;
  is_running: boolean;
  player: Player;
  current_scene: CurrentScene;
  log: LogEntry[];
  history: HistoryEntry[];
} 