'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/config';
import { GameState } from '../adventure/[id]/types';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [games, setGames] = useState<GameState[]>([]);
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
        console.log('API Response:', data); // Debug log
        
        // Handle both array and object responses
        const gamesData = Array.isArray(data) ? data : data.games || [];
        console.log('Processed games data:', gamesData); // Debug log
        
        setGames(gamesData);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error instanceof Error ? error.message : 'Failed to load games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Safely filter games only if they exist and have the required properties
  const filteredGames = games.filter(game => {
    console.log(game);
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (game.adventure.title?.toLowerCase() || '').includes(searchLower) ||
      (game.adventure.description?.toLowerCase() || '').includes(searchLower) ||
      (game.player.name?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] to-[#e6d5a7] dark:from-[#2c1810] dark:to-[#1a0f0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b4513] dark:border-[#d4af37] mx-auto"></div>
          <p className="mt-4 text-[#2c1810] dark:text-[#f4e4bc]">Loading adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] to-[#e6d5a7] dark:from-[#2c1810] dark:to-[#1a0f0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-fantasy"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] to-[#e6d5a7] dark:from-[#2c1810] dark:to-[#1a0f0a]">
      <header className="bg-[#f4e4bc] dark:bg-[#2c1810] border-b-2 border-[#8b4513] dark:border-[#d4af37]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.png"
                alt="RolePlayGent Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h1 className="text-3xl font-bold text-[#8b4513] dark:text-[#d4af37]">Your Adventures</h1>
            </div>
            <button
              onClick={() => router.push('/adventure/create')}
              className="btn-fantasy"
            >
              Create New Adventure
            </button>
          </div>
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
              className="input-fantasy w-full"
            />
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#2c1810] dark:text-[#f4e4bc] text-lg mb-4">
                {searchTerm ? 'No adventures found matching your search.' : 'No adventures yet.'}
              </p>
              <button
                onClick={() => router.push('/adventure/create')}
                className="btn-fantasy"
              >
                Create New Adventure
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="card-fantasy cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
                  onClick={() => router.push(`/adventure/${game.id}`)}
                >
                  <h2 className="text-xl font-bold text-[#8b4513] dark:text-[#d4af37] mb-2">
                    {game.adventure.title}
                  </h2>
                  <p className="text-[#2c1810] dark:text-[#f4e4bc] mb-4">
                    {game.adventure.description}
                  </p>
                  <div className="text-sm text-[#654321] dark:text-[#d4af37]">
                    <p>Character: {game.player.name}</p>
                    <p>Status: {game.is_running ? 'In Progress' : 'Completed'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 