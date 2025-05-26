import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { adventureId, message } = await request.json();

    // TODO: Implement actual AI agent communication
    // This is a placeholder response
    const response = {
      response: `XXXI understand you want to ${message}. As your AI Game Master, I'll help guide you through this adventure. What would you like to do next?`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 