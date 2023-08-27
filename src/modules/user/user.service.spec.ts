import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../modules/user/user.service';
import { HashService } from '../../services/hash.service';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../../entities/user.entity';

describe('UserService', () => {
    let userService: UserService;
    let userRepo: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [HashService, UserService, UserRepository],
            exports: [DatabaseModule],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepo = module.get<UserRepository>(UserRepository);
    });

    it('should be defined', () => {
        console.log({ userRepo });

        expect(userService).toBeDefined();
    });
});
