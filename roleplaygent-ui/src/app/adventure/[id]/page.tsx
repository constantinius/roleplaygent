'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import GameState from './components/GameState';
import ChatInterface from './components/ChatInterface';
import { Message, GameState as GameStateType, PageParams } from './types';

export default function AdventurePage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use React.use to handle async params
  const { id: gameId } = use(params);

  // Fetch game state
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game state');
        }
        const data = await response.json();
        console.log('Game state data:', data); // Debug log
        setGameState(data);
      } catch (error) {
        console.error('Error fetching game state:', error); // Debug log
        setError(error instanceof Error ? error.message : 'Failed to load game state');
      } finally {
        setLoading(false);
      }
    };

    fetchGameState();
  }, [gameId]);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    // Add the original user message to the chat
    const userMessage = message.replace(`Continuing story ${gameId}. `, '');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('http://localhost:8000/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return null;
  }

  const currentAct = gameState.acts[gameState.currentScene.act];
  const currentChapter = currentAct.chapters[gameState.currentScene.chapter];
  const currentScene = currentChapter.scenes[gameState.currentScene.scene];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <GameState
            currentAct={currentAct}
            currentChapter={currentChapter}
            currentScene={currentScene}
          />
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            gameId={gameId}
          />
        </div>
      </main>
    </div>
  );
} 