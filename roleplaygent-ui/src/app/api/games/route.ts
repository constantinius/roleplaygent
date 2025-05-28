import { NextResponse } from 'next/server';

interface GameState {
    id: string;
    adventure: {
        title: string;
        description: string;
    };
    player: {
        name: string;
        class: string;
        level: number;
    };
    current_scene: {
        act: number;
        chapter: number;
        scene: number;
    };
}

export async function GET() {
    try {
        // Call the backend API to get running games
        const response = await fetch('http://localhost:8000/api/games');
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        
        const games: GameState[] = await response.json();
        
        // Transform the games into a more API-friendly format
        const gameList = games.map(game => ({
            id: game.id,
            title: game.adventure.title,
            description: game.adventure.description,
            player: {
                name: game.player.name,
                class: game.player.class,
                level: game.player.level
            },
            currentScene: {
                act: game.current_scene.act,
                chapter: game.current_scene.chapter,
                scene: game.current_scene.scene
            }
        }));

        return NextResponse.json({ games: gameList });
    } catch (error) {
        console.error('Error listing games:', error);
        return NextResponse.json(
            { error: 'Failed to list games' },
            { status: 500 }
        );
    }
} 