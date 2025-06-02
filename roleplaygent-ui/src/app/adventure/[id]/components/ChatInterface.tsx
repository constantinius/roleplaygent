import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="card-fantasy">
      <div className="h-[600px] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-[#8b4513] dark:bg-[#d4af37] text-[#f4e4bc]'
                  : 'bg-[#f4e4bc] dark:bg-[#2c1810] text-[#2c1810] dark:text-[#f4e4bc] border-2 border-[#8b4513] dark:border-[#d4af37]'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f4e4bc] dark:bg-[#2c1810] rounded-lg p-4 border-2 border-[#8b4513] dark:border-[#d4af37]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#8b4513] dark:bg-[#d4af37] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#8b4513] dark:bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#8b4513] dark:bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t-2 border-[#8b4513] dark:border-[#d4af37] p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your action..."
            className="flex-1 px-4 py-2 rounded-lg border-2 border-[#8b4513] dark:border-[#d4af37] bg-white dark:bg-[#2c1810] text-[#2c1810] dark:text-[#f4e4bc] placeholder-[#654321] dark:placeholder-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#8b4513] dark:focus:ring-[#d4af37] focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-fantasy"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 