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
import { isError } from '../../utils';
import { Game } from '../models/game';
import { GameMapper } from '../../mapper/game-mapper';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(GameEntity)
        private readonly gameRepository: GameRepository,
        private readonly userService: UserService,
        private readonly gameMapper: GameMapper,
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

    async delete(gameId: string): Promise<DeleteResult> {
        return await this.gameRepository.delete({ id: gameId });
    }
}
