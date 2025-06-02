import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#f4e4bc] dark:bg-[#2c1810] border-b-2 border-[#8b4513] dark:border-[#d4af37]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-[#8b4513] dark:text-[#d4af37] hover:text-[#654321] dark:hover:text-[#f4e4bc] flex items-center transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="RolePlayGent Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
} 