import { NextResponse } from 'next/server';

interface GameState {
    id: string;
    adventure: {
        title: string;
        description: string;
        acts: Array<{
            title: string;
            description: string;
            chapters: Array<{
                title: string;
                description: string;
                scenes: Array<{
                    title: string;
                    description: string;
                    goal: string;
                    characters: string[];
                    encounter: boolean;
                    enemies: string[];
                }>;
            }>;
        }>;
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
    log: Array<{
        action: string;
        result: string;
        act: number;
        chapter: number;
        scene: number;
    }>;
}

export async function GET(
    request: Request,
    {params}, 
) {
    try {
        const { id } = await params;
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
                class: game.player.class,
                level: game.player.level
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