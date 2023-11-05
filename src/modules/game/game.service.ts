import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { GameEntity, GameRepository } from '../../entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { DeleteResult, InsertResult } from 'typeorm';
import { isError, throwErrorOrContinue } from '../../utils';
import { Game } from '../models/game';
import { GameMapper } from '../../mapper/game-mapper';
import {
    GameImageEntity,
    GameImageRepository,
} from '../../entities/game-image.entity';
import dataSource from '../database/database.data-source';
import { GameImage } from '../models/game-image';
import { GameImageMapper } from '../../mapper/game-image-mapper';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: GameRepository,
        private readonly gameImageRepository: GameImageRepository,
        private readonly userService: UserService,
        private readonly gameMapper: GameMapper,
        private readonly gameImageMapper: GameImageMapper,
    ) {}

    async create(
        game: Game,
    ): Promise<
        | InsertResult
        | InternalServerErrorException
        | BadRequestException
        | NotFoundException
    > {
        try {
            const entity = this.gameMapper.toEntity(game);
            const user = await this.userService.findUserById(entity.user_id);

            if (isError(user)) {
                return user;
            }

            return this.gameRepository.insert(entity);
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async deleteGameImage(
        gameImageId: string,
    ): Promise<
        DeleteResult | InternalServerErrorException | NotFoundException
    > {
        try {
            const exists = await this.gameImageRepository.exist({
                where: { id: gameImageId },
            });

            if (!exists) {
                return new NotFoundException('Game image not found');
            }

            return await this.gameImageRepository.delete({
                id: gameImageId,
            });
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async getGameImageById(
        gameImageId: string,
    ): Promise<GameImage | InternalServerErrorException | NotFoundException> {
        try {
            const entity = await this.gameImageRepository.findOneBy({
                id: gameImageId,
            });

            if (!entity) {
                return new NotFoundException('Game image not found');
            }

            return this.gameImageMapper.toModel(entity);
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async saveGameImage(
        gameImage: GameImage,
    ): Promise<GameImage | InternalServerErrorException> {
        try {
            const entity = this.gameImageRepository.create({
                id: gameImage.id,
                cover: gameImage.cover,
                game_id: gameImage.gameId,
                image_path: gameImage.imagePath,
            });

            return await new Promise((resolve) => {
                dataSource.transaction(async (manager) => {
                    if (gameImage.cover) {
                        const allGames = await manager.find(GameImageEntity, {
                            where: { game_id: gameImage.gameId },
                        });

                        Promise.allSettled(
                            allGames.map((gameImage) => {
                                gameImage.cover = false;
                                return manager.save(gameImage);
                            }),
                        );
                    }

                    const gameImageEntity = await manager.save(entity);

                    return resolve(
                        this.gameImageMapper.toModel(gameImageEntity),
                    );
                });
            });
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async find(): Promise<Game[]> {
        const entities = await this.gameRepository.find({ cache: true });
        return entities.map((entity) => this.gameMapper.toModel(entity));
    }

    async findWithFilter(data: {
        limit: number;
        start: number;
        sort: string;
    }): Promise<[Game[], number]> {
        const [entities, count] = await this.gameRepository.findAndCount({
            cache: true,
            order: { [data.sort]: 'asc' },
        });

        const start =
            data.start > entities.length ? entities.length : data.start;

        const limit = start > data.limit ? start : data.limit;

        const models = entities
            .map(this.gameMapper.toModel)
            .slice(start, limit);

        return [models, count];
    }

    async verifyUserExists(userId: string): Promise<boolean> {
        try {
            const userExists = await this.gameRepository.exist({
                where: {
                    id: userId,
                },
            });

            return userExists;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async verifyUserOwnGameImage(
        userId: string,
        gameImageId: string,
    ): Promise<boolean> {
        try {
            if (!(await this.verifyUserExists(userId))) {
                throw new NotFoundException('User not exists');
            }

            const gameImage = await this.getGameImageById(gameImageId);

            throwErrorOrContinue(gameImage);

            return await this.verifyUserOwnGame(userId, gameImage.gameId);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async verifyUserOwnGame(userId: string, gameId: string): Promise<boolean> {
        try {
            if (!(await this.verifyUserExists(userId))) {
                throw new NotFoundException('User not exists');
            }

            const game = await this.getGameById(gameId);

            throwErrorOrContinue(game);

            return game.userId === userId;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async getGameById(
        gameId: string,
    ): Promise<Game | NotFoundException | InternalServerErrorException> {
        try {
            const entity = await this.gameRepository.findOneBy({ id: gameId });
            if (!entity) return new NotFoundException('Game not found');
            return this.gameMapper.toModel(entity);
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async findGamesByUserId(userId: string): Promise<Game[]> {
        const games = await this.gameRepository.find({
            where: { user_id: userId },
        });

        return games.map((entity) => this.gameMapper.toModel(entity));
    }

    async deleteGame(gameId: string): Promise<DeleteResult> {
        return await this.gameRepository.delete({ id: gameId });
    }
}
