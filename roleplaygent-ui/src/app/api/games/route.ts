import { NextResponse } from 'next/server';
import { GameState } from '@/app/adventure/[id]/types';

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
                description: game.player.description,
                appearance: game.player.appearance,
                personality: game.player.personality,
                backstory: game.player.backstory,
                goals: game.player.goals,
                health: game.player.health,
                strength: game.player.strength,
                agility: game.player.agility,
                intelligence: game.player.intelligence,
                charisma: game.player.charisma,
                endurance: game.player.endurance,
                inventory: game.player.inventory
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