import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { GameModule } from './game.module';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '../database/database.module';
import { ZipService } from '../../services/zip.service';
import { GameMapper } from '../../mapper/game-mapper';
import { GameController } from './game.controller';
import { UserRepository } from '../../entities/user.entity';
import { GameRepository } from '../../entities/game.entity';
import { HashService } from '../../services/hash.service';

describe('GameService', () => {
    let gameService: GameService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, UserModule, GameModule],
            providers: [
                GameMapper,
                HashService,
                ZipService,
                UserRepository,
                GameRepository,
            ],
            exports: [],
        }).compile();

        gameService = module.get<GameService>(GameService);
    });

    it('game service should be defined', () => {
        expect(gameService).toBeDefined();
    });
});
