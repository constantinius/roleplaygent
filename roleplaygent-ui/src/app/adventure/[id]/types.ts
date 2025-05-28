export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface PageParams {
  id: string;
}

export interface Character {
  name: string;
  description: string;
  appearance: string;
  personality: string;
  backstory: string;
  goals: string;
}

export interface GameState {
  title: string;
  description: string;
  player: {
    name: string;
    class: string;
    level: number;
    description?: string;
    appearance?: string;
    personality?: string;
    backstory?: string;
    goals?: string;
  };
  acts: Array<{
    title: string;
    description: string;
    chapters: Array<{
      title: string;
      description: string;
      scenes: Array<{
        title: string;
        description: string;
        goal: string;
        characters: Array<string | Character>;
        encounter: boolean;
        enemies: string[];
      }>;
    }>;
  }>;
  currentScene: {
    act: number;
    chapter: number;
    scene: number;
    characters: string[];
    enemies: string[];
  };
} 