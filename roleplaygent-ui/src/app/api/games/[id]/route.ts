import { NextResponse } from 'next/server';
import { GameState } from '@/app/adventure/[id]/types';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(
    request: Request,
    { params }: RouteParams
) {
    try {
        const { id } = params;
        // Call the backend API to get the game
        const response = await fetch(`http://localhost:8000/api/games/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch game');
        }
        
        const game: GameState = await response.json();
        
        // Transform the game into a more API-friendly format
        const gameData = {
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
            },
            acts: game.adventure.acts.map(act => ({
                title: act.title,
                description: act.description,
                chapters: act.chapters.map(chapter => ({
                    title: chapter.title,
                    description: chapter.description,
                    scenes: chapter.scenes.map(scene => ({
                        title: scene.title,
                        description: scene.description,
                        goal: scene.goal,
                        characters: scene.characters,
                        encounter: scene.encounter,
                        enemies: scene.enemies
                    }))
                }))
            })),
            log: game.log
        };

        return NextResponse.json(gameData);
    } catch (error) {
        console.error('Error fetching game:', error);
        return NextResponse.json(
            { error: 'Failed to fetch game' },
            { status: 500 }
        );
    }
} 