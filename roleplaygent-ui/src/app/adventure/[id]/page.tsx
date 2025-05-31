'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/config';
import Header from './components/Header';
import GameState from './components/GameState';
import ChatInterface from './components/ChatInterface';
import { Message, GameState as GameStateType, PageParams } from './types';

export default function AdventurePage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use React.use to handle async params
  const { id: gameId } = use(params);

  // Fetch game state
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`${config.agentUrl}/api/games/${gameId}`);
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
    setLoading(true);
    try {
      // Add user message to chat
      const userMessage: Message = {
        role: 'user',
        content: message,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Send message to agent
      const response = await fetch(`${config.agentUrl}/api/games/${gameId}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from agent');
      }

      const data = await response.json();
      const agentMessage: Message = {
        role: 'assistant',
        content: data.response,
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading adventure...</p>
        </div>
      </div>
    );
  }

  const currentAct = gameState.adventure.acts[gameState.current_scene.act];
  const currentChapter = currentAct.chapters[gameState.current_scene.chapter];
  const currentScene = currentChapter.scenes[gameState.current_scene.scene];

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
            isLoading={loading}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
} 