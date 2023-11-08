import { Injectable } from '@nestjs/common';
import { GameImageEntity } from '../entities/game-image.entity';
import { GameImage } from '../modules/models/game-image';
import { getRoutes } from '../helpers/get-routes.helper';

@Injectable()
export class GameImageMapper {
    toModel(gameImageEntity: GameImageEntity): GameImage {
        return new GameImage(
            {
                cover: gameImageEntity.cover,
                gameId: gameImageEntity.game_id,
                imagePath: gameImageEntity.image_path,
                createdAt: gameImageEntity.created_at,
                updatedAt: undefined,
            },
            gameImageEntity.id,
        );
    }
    toEntity(gameImage: GameImage): GameImageEntity {
        const gameImageEntity = new GameImageEntity();
        gameImageEntity.id = gameImage.id;
        gameImageEntity.cover = gameImage.cover;
        gameImageEntity.game_id = gameImage.gameId;
        gameImageEntity.image_path = gameImage.imagePath;
        gameImageEntity.created_at = gameImage.createdAt;
        return gameImageEntity;
    }
    toHTTP(gameImage: GameImage) {
        return JSON.parse(
            JSON.stringify({
                id: gameImage.id,
                cover: gameImage.cover,
                gameId: gameImage.gameId,
                createdAt: gameImage.createdAt,
                addGameImageUrl: getRoutes().add_game_image_url.replace(
                    '{id}',
                    gameImage.gameId,
                ),
                removeGameImageUrl: getRoutes().remove_game_image_url.replace(
                    '{game-image-id}',
                    gameImage.id,
                ),
            }),
        );
    }
}
