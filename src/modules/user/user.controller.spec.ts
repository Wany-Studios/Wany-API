import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { HashService } from '../../services/hash.service';
import { UserService } from './user.service';
import { INestApplication } from '@nestjs/common';

describe('UserController', () => {
    let userController: UserController;
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            controllers: [UserController],
            providers: [UserService, HashService],
        }).compile();

        userController = module.get<UserController>(UserController);
        app = module.createNestApplication();
        await app.init();
    });

    it('user controller should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('/GET should return not found', () => {
        return request(app.getHttpServer())
            .get('/users/public/username')
            .expect(404);
    });

    afterAll(async () => {
        await app.close();
    });
});
