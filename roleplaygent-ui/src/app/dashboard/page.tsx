'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for demonstration
const mockAdventures = [
  { 
    id: 1, 
    title: 'The Dragon\'s Lair', 
    status: 'running', 
    createdAt: '2024-03-20',
    thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop'
  },
  { 
    id: 2, 
    title: 'Mystic Forest Quest', 
    status: 'completed', 
    createdAt: '2024-03-15',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop'
  },
  { 
    id: 3, 
    title: 'Space Odyssey', 
    status: 'running', 
    createdAt: '2024-03-18',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
  },
];

export default function Dashboard() {
  const [adventures, setAdventures] = useState(mockAdventures);
  const [activeTab, setActiveTab] = useState('all');

  const filteredAdventures = adventures.filter(adventure => {
    if (activeTab === 'all') return true;
    return adventure.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Adventures</h1>
          <Link
            href="/adventure/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Create New Adventure
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['all', 'running', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Adventures List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAdventures.map((adventure) => (
            <Link
              key={adventure.id}
              href={`/adventure/${adventure.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={adventure.thumbnail}
                  alt={adventure.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {adventure.title}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created on {adventure.createdAt}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      adventure.status === 'running'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    {adventure.status.charAt(0).toUpperCase() + adventure.status.slice(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredAdventures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No adventures found. Create your first adventure to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 