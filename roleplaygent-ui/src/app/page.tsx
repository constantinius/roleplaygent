'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] to-[#e6d5a7] dark:from-[#2c1810] dark:to-[#1a0f0a]">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="card-fantasy max-w-2xl p-8 mb-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="RolePlayGent Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h1 className="text-6xl font-bold mb-6 text-[#8b4513] dark:text-[#d4af37]">
              RolePlayGent
            </h1>
            <p className="text-xl text-[#2c1810] dark:text-[#f4e4bc] mb-8">
              Embark on epic quests and weave tales of magic and adventure in your own fantasy world.
            </p>
            <button
              className="btn-fantasy text-lg"
              onClick={() => {
                router.push('/dashboard');
              }}
            >
              Begin Your Journey
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            <div className="card-fantasy p-6">
              <h2 className="text-2xl font-bold text-[#8b4513] dark:text-[#d4af37] mb-4">Create</h2>
              <p className="text-[#2c1810] dark:text-[#f4e4bc]">Craft your own unique character and world</p>
            </div>
            <div className="card-fantasy p-6">
              <h2 className="text-2xl font-bold text-[#8b4513] dark:text-[#d4af37] mb-4">Explore</h2>
              <p className="text-[#2c1810] dark:text-[#f4e4bc]">Journey through magical realms and ancient ruins</p>
            </div>
            <div className="card-fantasy p-6">
              <h2 className="text-2xl font-bold text-[#8b4513] dark:text-[#d4af37] mb-4">Adventure</h2>
              <p className="text-[#2c1810] dark:text-[#f4e4bc]">Face challenges and forge your legend</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
