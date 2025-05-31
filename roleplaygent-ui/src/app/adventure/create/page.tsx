'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character, Player } from '../[id]/types';

const RACES = ['human', 'dwarf', 'elf', 'ork', 'halfling'] as const;
const CLASSES = ['knight', 'cleric', 'ranger', 'druid', 'wizard', 'rogue'] as const;
const SETTINGS = ['fantasy', 'dark fantasy'] as const;

type Race = typeof RACES[number];
type Class = typeof CLASSES[number];

interface CharacterForm extends Omit<Character, 'health' | 'strength' | 'agility' | 'intelligence' | 'charisma' | 'endurance'> {
  race: Race;
  class: Class;
}

interface World {
  setting: typeof SETTINGS[number];
  matureThemes: boolean;
  description: string;
}

// Character name generators for each race
const NAME_GENERATORS: Record<Race, () => string> = {
  human: () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  },
  dwarf: () => {
    const prefixes = ['Thorin', 'Gimli', 'Balin', 'Dwalin', 'Bifur', 'Bofur'];
    const suffixes = ['Ironbeard', 'Stonefist', 'Goldaxe', 'Silverhammer', 'Bronzebeard', 'Steelheart'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
      suffixes[Math.floor(Math.random() * suffixes.length)]
    }`;
  },
  elf: () => {
    const prefixes = ['Legolas', 'Elrond', 'Galadriel', 'Arwen', 'Thranduil', 'Celeborn'];
    const suffixes = ['Moonwhisper', 'Starlight', 'Sunshadow', 'Nightwind', 'Dawnbringer', 'Eveningstar'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
      suffixes[Math.floor(Math.random() * suffixes.length)]
    }`;
  },
  ork: () => {
    const prefixes = ['Grom', 'Thokk', 'Grimgor', 'Azog', 'Uruk', 'Snaga'];
    const suffixes = ['Ironjaw', 'Skullcrusher', 'Bonebreaker', 'Bloodaxe', 'Deathfist', 'Warcry'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
      suffixes[Math.floor(Math.random() * suffixes.length)]
    }`;
  },
  halfling: () => {
    const firstNames = ['Bilbo', 'Frodo', 'Samwise', 'Pippin', 'Merry', 'Rosie'];
    const lastNames = ['Baggins', 'Gamgee', 'Took', 'Brandybuck', 'Cotton', 'Proudfoot'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  },
};

// Character description templates
const DESCRIPTION_TEMPLATES: Record<Class, (race: Race) => string> = {
  knight: (race) => `A noble ${race} knight, clad in shining armor and sworn to protect the innocent. Their reputation for honor and courage precedes them.`,
  cleric: (race) => `A devout ${race} cleric, wielding divine magic to heal the wounded and smite the wicked. Their faith is their greatest strength.`,
  ranger: (race) => `A skilled ${race} ranger, at home in the wilderness. Their keen eyes and steady hands make them deadly with a bow.`,
  druid: (race) => `A wise ${race} druid, attuned to the natural world. They can commune with animals and harness the power of nature.`,
  wizard: (race) => `A learned ${race} wizard, studying the arcane arts for decades. Their mastery of magic makes them a formidable ally.`,
  rogue: (race) => `A cunning ${race} rogue, moving unseen in the shadows. Their quick wit and quicker hands make them excellent at getting into and out of trouble.`,
};

export default function CreateAdventure() {
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterForm>({
    name: '',
    description: '',
    appearance: '',
    personality: '',
    backstory: '',
    goals: '',
    race: RACES[0],
    class: CLASSES[0],
  });

  const [world, setWorld] = useState<World>({
    setting: SETTINGS[0],
    matureThemes: false,
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCharacterChange = (field: keyof typeof character, value: string | Race | Class) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const handleWorldChange = (field: keyof typeof world, value: string | boolean) => {
    setWorld(prev => ({ ...prev, [field]: value }));
  };

  const randomizeCharacter = () => {
    const randomRace = RACES[Math.floor(Math.random() * RACES.length)];
    const randomClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
    
    setCharacter({
      name: NAME_GENERATORS[randomRace](),
      description: DESCRIPTION_TEMPLATES[randomClass](randomRace),
      appearance: `A typical ${randomRace} ${randomClass}, with features common to their race and profession.`,
      personality: `A ${randomRace} ${randomClass} with a strong sense of duty and honor.`,
      backstory: `Born and raised in a ${randomRace} community, they trained as a ${randomClass} from a young age.`,
      goals: `To become the greatest ${randomClass} in the land and bring honor to their ${randomRace} heritage.`,
      race: randomRace,
      class: randomClass,
    });
  };

  const generateWorldDescription = () => {
    const generatedDescription = `A ${world.setting} world where ${character.race} ${character.class}s roam the lands. The atmosphere is ${world.matureThemes ? 'dark and mature' : 'light and adventurous'}, perfect for epic tales and grand adventures.`;
    setWorld(prev => ({ ...prev, description: generatedDescription }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create a full Player object with default attributes
      const player: Player = {
        ...character,
        health: 100,
        strength: 10,
        agility: 10,
        intelligence: 10,
        charisma: 10,
        endurance: 10,
        inventory: []
      };

      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: player,
          world,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create adventure');
      }

      const data = await response.json();
      router.push(`/adventure/${data.id}`);
    } catch (error) {
      console.error('Error creating adventure:', error);
      setError(error instanceof Error ? error.message : 'Failed to create adventure');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Adventure</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Character Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Character</h2>
                <button
                  type="button"
                  onClick={randomizeCharacter}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Randomize
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Character Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={character.name}
                    onChange={(e) => handleCharacterChange('name', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Character Description
                  </label>
                  <textarea
                    id="description"
                    value={character.description}
                    onChange={(e) => handleCharacterChange('description', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="appearance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Appearance
                  </label>
                  <textarea
                    id="appearance"
                    value={character.appearance}
                    onChange={(e) => handleCharacterChange('appearance', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="personality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Personality
                  </label>
                  <textarea
                    id="personality"
                    value={character.personality}
                    onChange={(e) => handleCharacterChange('personality', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="backstory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Backstory
                  </label>
                  <textarea
                    id="backstory"
                    value={character.backstory}
                    onChange={(e) => handleCharacterChange('backstory', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Goals
                  </label>
                  <textarea
                    id="goals"
                    value={character.goals}
                    onChange={(e) => handleCharacterChange('goals', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="race" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Race
                    </label>
                    <select
                      id="race"
                      value={character.race}
                      onChange={(e) => handleCharacterChange('race', e.target.value as Race)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      {RACES.map((race) => (
                        <option key={race} value={race}>
                          {race.charAt(0).toUpperCase() + race.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Class
                    </label>
                    <select
                      id="class"
                      value={character.class}
                      onChange={(e) => handleCharacterChange('class', e.target.value as Class)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      {CLASSES.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls.charAt(0).toUpperCase() + cls.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* World Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">World</h2>
                <button
                  type="button"
                  onClick={generateWorldDescription}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Generate Description
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="setting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Setting
                  </label>
                  <select
                    id="setting"
                    value={world.setting}
                    onChange={(e) => handleWorldChange('setting', e.target.value as typeof SETTINGS[number])}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {SETTINGS.map((setting) => (
                      <option key={setting} value={setting}>
                        {setting.charAt(0).toUpperCase() + setting.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={world.matureThemes}
                      onChange={(e) => handleWorldChange('matureThemes', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Include Mature Themes
                    </span>
                  </label>
                </div>

                <div>
                  <label htmlFor="worldDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    World Description
                  </label>
                  <textarea
                    id="worldDescription"
                    value={world.description}
                    onChange={(e) => handleWorldChange('description', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Adventure'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 