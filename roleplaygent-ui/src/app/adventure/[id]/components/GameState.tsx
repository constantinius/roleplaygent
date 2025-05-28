import { useState } from 'react';
import { Character } from '../types';

interface GameStateProps {
  currentAct: {
    title: string;
    description: string;
  };
  currentChapter: {
    title: string;
    description: string;
  };
  currentScene: {
    title: string;
    description: string;
    goal: string;
    characters: Array<string | Character>;
    enemies: string[];
  };
}

export default function GameState({ currentAct, currentChapter, currentScene }: GameStateProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Game State</h2>
        <svg
          className={`w-6 h-6 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Act</h3>
            <p className="text-gray-700 dark:text-gray-300">{currentAct.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentAct.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Chapter</h3>
            <p className="text-gray-700 dark:text-gray-300">{currentChapter.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentChapter.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Scene</h3>
            <p className="text-gray-700 dark:text-gray-300">{currentScene.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentScene.description}</p>
            <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Goal: {currentScene.goal}</p>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Characters</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {currentScene.characters.map((character, index) => (
                  <li key={index}>
                    {typeof character === 'string' ? character : character.name}
                  </li>
                ))}
              </ul>
            </div>
            {currentScene.enemies.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Enemies:</p>
                <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
                  {currentScene.enemies.map((enemy, index) => (
                    <li key={index}>{enemy}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 