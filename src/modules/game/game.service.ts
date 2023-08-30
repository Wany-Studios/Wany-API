import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Game, GameRepository } from '../../entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { DeleteResult, InsertResult } from 'typeorm';
import { isError } from '../../utils';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private readonly gameRepository: GameRepository,
        private readonly userService: UserService,
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
            const user = await this.userService.findUserById(game.id);

            if (isError(user)) {
                return user;
            }

            return this.gameRepository.insert(game);
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async find(): Promise<Game[]> {
        return await this.gameRepository.find({ cache: true });
    }

    async getGameById(
        gameId: string,
    ): Promise<Game | NotFoundException | InternalServerErrorException> {
        try {
            const game = await this.gameRepository.findOneBy({ id: gameId });
            if (!game) return new NotFoundException('Game not found');
            return game;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async findGamesByUserId(userId: string): Promise<Game[]> {
        return await this.gameRepository.find({ where: { user_id: userId } });
    }

    async delete(userId: string): Promise<DeleteResult> {
        return await this.gameRepository.delete(userId);
    }
}
