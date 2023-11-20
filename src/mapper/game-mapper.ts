import { Injectable } from '@nestjs/common';
import { GameEntity } from '../entities/game.entity';
import { Game } from '../modules/models/game';
import { Genre } from '../modules/models/genre';
import { getRoutes } from '../helpers/get-routes.helper';

@Injectable()
export class GameMapper {
    toModel(gameEntity: GameEntity): Game {
        return new Game(
            {
                description: gameEntity.description,
                genre: gameEntity.genre as Genre,
                title: gameEntity.title,
                createdAt: gameEntity.created_at,
                updatedAt: gameEntity.updated_at,
                gamePath: gameEntity.game_path,
                userId: gameEntity.user_id,
                imageIDs: [],
            },
            gameEntity.id,
        );
    }
    toEntity(game: Game): GameEntity {
        const gameEntity = new GameEntity();
        gameEntity.id = game.id;
        gameEntity.created_at = game.createdAt;
        gameEntity.updated_at = game.updatedAt;
        gameEntity.description = game.description;
        gameEntity.title = game.title;
        gameEntity.game_path = game.gamePath;
        gameEntity.user_id = game.userId;
        gameEntity.genre = game.genre;
        return gameEntity;
    }
    toHTTP(game: Game) {
        return JSON.parse(
            JSON.stringify({
                id: game.id,
                description: game.description,
                genre: game.genre,
                createdAt: game.createdAt,
                updatedAt: game.updatedAt,
                title: game.title,
                userId: game.userId,
                my_games_url: getRoutes().my_games_url,
                add_game_image_url: getRoutes().add_game_image_url.replace(
                    '{id}',
                    game.id,
                ),
                public_game_url: getRoutes().public_game_url.replace(
                    '{game-path}',
                    game.gamePath,
                ),
                public_game_image_urls: (game.imageIDs || []).map((imageId) =>
                    getRoutes().public_game_image_url.replace(
                        '{game-image-id}',
                        imageId,
                    ),
                ),
                public_get_game_url: getRoutes().public_get_game_url.replace(
                    '{id}',
                    game.id,
                ),
                delete_game_url: getRoutes().delete_game_url.replace(
                    '{id}',
                    game.id,
                ),
            }),
        );
    }
}
