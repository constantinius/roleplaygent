'use client';

import { config } from '@/config';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GameState } from '../adventure/[id]/types';

interface Game {
  id: string;
  title: string;
  description: string;
  player: {
    name: string;
    class: string;
    level: number;
  };
  currentScene: {
    act: number;
    chapter: number;
    scene: number;
  };
}

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${config.agentUrl}/api/games`);
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data.games);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error instanceof Error ? error.message : 'Failed to load games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Adventures</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search adventures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <Link
                key={game.id}
                href={`/adventure/${game.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {game.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {game.description}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p>Player: {game.player.name}</p>
                        <p>Class: {game.player.class}</p>
                        <p>Level: {game.player.level}</p>
                        <p className="mt-2">
                          Current Scene: Act {game.currentScene.act + 1}, Chapter {game.currentScene.chapter + 1}, Scene {game.currentScene.scene + 1}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Running
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No adventures found. Create your first adventure to get started!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 