import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
    createUserFactory,
    getMongooseFeatures,
    mongoTestingModule,
} from '../../utils.testing';
import { UserService } from '../../modules/user/user.service';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { HashService } from '../../services/hash.service';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [mongoTestingModule(), getMongooseFeatures()],
            providers: [UserService, HashService],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user', async () => {
        const user = createUserFactory();
        const result = await userService.create(user);
    });
});
