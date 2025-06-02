import { useState } from 'react';
import { Act, Chapter, Scene, Enemy } from '../types';

interface GameStateProps {
  currentAct: Act;
  currentChapter: Chapter;
  currentScene: Scene;
}

export default function GameState({ currentAct, currentChapter, currentScene }: GameStateProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card-fantasy mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-[#f4e4bc]/10 dark:hover:bg-[#2c1810]/10 transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold text-[#8b4513] dark:text-[#d4af37]">Current Game State</h2>
        <svg
          className={`w-6 h-6 text-[#8b4513] dark:text-[#d4af37] transform transition-transform duration-200 ${
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
            <h3 className="text-lg font-medium text-[#8b4513] dark:text-[#d4af37] mb-2">Current Act</h3>
            <p className="text-[#2c1810] dark:text-[#f4e4bc]">{currentAct.title}</p>
            <p className="text-sm text-[#654321] dark:text-[#d4af37]">{currentAct.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#8b4513] dark:text-[#d4af37] mb-2">Current Chapter</h3>
            <p className="text-[#2c1810] dark:text-[#f4e4bc]">{currentChapter.title}</p>
            <p className="text-sm text-[#654321] dark:text-[#d4af37]">{currentChapter.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#8b4513] dark:text-[#d4af37] mb-2">Current Scene</h3>
            <p className="text-[#2c1810] dark:text-[#f4e4bc]">{currentScene.title}</p>
            <p className="text-sm text-[#654321] dark:text-[#d4af37]">{currentScene.description}</p>
            <p className="mt-2 text-sm font-medium text-[#8b4513] dark:text-[#d4af37]">Goal: {currentScene.goal}</p>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-[#8b4513] dark:text-[#d4af37]">Characters</h3>
              <ul className="list-disc list-inside text-[#2c1810] dark:text-[#f4e4bc]">
                {currentScene.characters.map((character: string, index: number) => (
                  <li key={index}>{character}</li>
                ))}
              </ul>
            </div>
            {currentScene.enemies.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-[#8b4513] dark:text-[#d4af37]">Enemies:</p>
                <ul className="list-disc list-inside text-sm text-[#654321] dark:text-[#d4af37]">
                  {currentScene.enemies.map((enemy: Enemy, index: number) => (
                    <li key={index}>{enemy.name}</li>
                  ))}
                </ul>
              </div>
            )}
            {currentScene.challenges.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-[#8b4513] dark:text-[#d4af37]">Challenges:</p>
                <ul className="list-disc list-inside text-sm text-[#654321] dark:text-[#d4af37]">
                  {currentScene.challenges.map((challenge: string, index: number) => (
                    <li key={index}>{challenge}</li>
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