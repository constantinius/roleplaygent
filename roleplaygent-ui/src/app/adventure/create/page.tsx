'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RACES = ['human', 'dwarf', 'elf', 'ork', 'halfling'] as const;
const CLASSES = ['knight', 'cleric', 'ranger', 'druid', 'wizard', 'rogue'] as const;
const SETTINGS = ['fantasy', 'dark fantasy'] as const;

type Race = typeof RACES[number];
type Class = typeof CLASSES[number];

interface Character {
  name: string;
  description: string;
  race: Race;
  class: Class;
}

interface World {
  setting: string;
  matureThemes: boolean;
  description: string;
}

// Character name generators for each race
const NAME_GENERATORS: Record<Race, () => string> = {
  human: () => {
    const firstNames = ['James', 'Sarah', 'Michael', 'Emma', 'William', 'Olivia', 'David', 'Sophia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  },
  dwarf: () => {
    const prefixes = ['Thorin', 'Balin', 'Dwalin', 'Bifur', 'Bofur', 'Bombur'];
    const suffixes = ['Ironbeard', 'Stonefist', 'Goldaxe', 'Silverhammer', 'Bronzebeard'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  elf: () => {
    const prefixes = ['Elrond', 'Galadriel', 'Legolas', 'Arwen', 'Celeborn', 'Thranduil'];
    const suffixes = ['Moonwhisper', 'Starlight', 'Nightwind', 'Dawnbringer', 'Silverleaf'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  ork: () => {
    const prefixes = ['Grom', 'Thokk', 'Grimgor', 'Skarsnik', 'Azog', 'Uruk'];
    const suffixes = ['Ironjaw', 'Skullcrusher', 'Bonebreaker', 'Bloodaxe', 'Deathfist'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  halfling: () => {
    const firstNames = ['Bilbo', 'Frodo', 'Samwise', 'Pippin', 'Merry', 'Rosie'];
    const lastNames = ['Baggins', 'Took', 'Brandybuck', 'Gamgee', 'Cotton'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
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
  const [character, setCharacter] = useState<Character>({
    name: '',
    description: '',
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

  const handleCharacterChange = (field: keyof typeof character, value: string) => {
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
      const response = await fetch('http://localhost:8000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character,
          world,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create adventure');
      }

      const data = await response.json();
      
      // Extract the game ID from the response
      // This assumes the game master agent returns a game ID in its response
      const gameId = data.response.id;
      
      // Redirect to the new game
      router.push(`/adventure/${gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create adventure');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Adventure</h1>
          
          {error && (
            <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Character Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Character</h2>
                <button
                  type="button"
                  onClick={randomizeCharacter}
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Randomize Character
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="race" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Race
                    </label>
                    <select
                      id="race"
                      value={character.race}
                      onChange={(e) => handleCharacterChange('race', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {RACES.map(race => (
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
                      onChange={(e) => handleCharacterChange('class', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {CLASSES.map(cls => (
                        <option key={cls} value={cls}>
                          {cls.charAt(0).toUpperCase() + cls.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* World Section */}
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">World Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="setting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Setting
                  </label>
                  <select
                    id="setting"
                    value={world.setting}
                    onChange={(e) => handleWorldChange('setting', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {SETTINGS.map(setting => (
                      <option key={setting} value={setting}>
                        {setting.charAt(0).toUpperCase() + setting.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="matureThemes"
                    checked={world.matureThemes}
                    onChange={(e) => handleWorldChange('matureThemes', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="matureThemes" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Enable mature themes (violence, romance)
                  </label>
                </div>

                <div>
                  <label htmlFor="worldDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    World Description
                  </label>
                  <div className="space-y-2">
                    <textarea
                      id="worldDescription"
                      value={world.description}
                      onChange={(e) => handleWorldChange('description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                      required
                    />
                    <button
                      type="button"
                      onClick={generateWorldDescription}
                      className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Generate Description
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Adventure...' : 'Start Adventure'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 