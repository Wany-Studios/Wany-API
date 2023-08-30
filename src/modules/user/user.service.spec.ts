import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../modules/user/user.service';
import { HashService } from '../../services/hash.service';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from './user.module';
import { createUserFactory } from '../../utils.testing';
import { Role, UserRepository } from '../../entities/user.entity';
import { isError } from '../../utils';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule, UserModule],
            providers: [HashService, UserRepository],
            exports: [],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    it('user service should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should create a user', async () => {
        const user = createUserFactory();

        await userService.create(user);

        const result = await userService.findUserByUsername(user.username!);

        expect(result).not.toBe(Error);

        if (!isError(result)) {
            expect(result.id).toBe(user.id);
            expect(result.username).toBe(user.username!.toLowerCase());
            expect(result.email).toBe(user.email!.toLowerCase());
            expect(result.birth_date!.getTime()).toBe(
                user.birth_date!.getTime(),
            );
            expect(result.role).toBe(user.role);
            expect(result.situation).toBe(user.situation);
        }
    });

    it('should update a user', async () => {
        const user = createUserFactory();
        const updatedUserData = createUserFactory({ role: Role.Admin });

        await userService.create(user);

        const updatedUser = await userService.update(user.id!, updatedUserData);

        expect(updatedUser).not.toBe(Error);

        if (!isError(updatedUser)) {
            expect(updatedUser.id).toBe(user.id);
            expect(updatedUser.username).toBe(
                updatedUserData.username!.toLowerCase(),
            );
            expect(updatedUser.email).toBe(
                updatedUserData.email!.toLowerCase(),
            );
            expect(updatedUser.birth_date!.getTime()).toBe(
                updatedUserData.birth_date!.getTime(),
            );
            expect(updatedUser.role).toBe(updatedUserData.role);
            expect(updatedUser.situation).toBe(updatedUserData.situation);
        }
    });

    it('should find all users', async () => {
        const users = [createUserFactory(), createUserFactory()];
        await Promise.allSettled(users.map((user) => userService.create(user)));
        const foundUsers = await userService.find();

        expect(foundUsers).toHaveLength(users.length);

        if (foundUsers.length == users.length) {
            for (const user of users) {
                expect(foundUsers.map((u) => u.id)).toContain(user.id);
            }
        }
    });

    it('should find a user by username', async () => {
        const user = createUserFactory();

        await userService.create(user);
        const foundUser = await userService.findUserByUsername(user.username!);

        expect(foundUser).not.toBe(Error);

        if (!isError(foundUser)) {
            expect(foundUser.id).toBe(user.id);
            expect(foundUser.username).toBe(user.username!.toLowerCase());
            expect(foundUser.email).toBe(user.email!.toLowerCase());
            expect(foundUser.birth_date!.getTime()).toBe(
                user.birth_date!.getTime(),
            );
            expect(foundUser.role).toBe(user.role);
            expect(foundUser.situation).toBe(user.situation);
        }
    });

    it('should find a user by username or email', async () => {
        const user = createUserFactory();
        await userService.create(user);

        const foundUserByUsername = await userService.findUserByUsernameOrEmail(
            user.username!,
        );

        const foundUserByEmail = await userService.findUserByUsernameOrEmail(
            user.email!,
        );

        expect(foundUserByUsername).not.toBe(Error);
        expect(foundUserByEmail).not.toBe(Error);

        if (!isError(foundUserByUsername)) {
            expect(foundUserByUsername!.username).toBe(
                user.username!.toLowerCase(),
            );
        }

        if (!isError(foundUserByEmail)) {
            expect(foundUserByEmail!.email).toBe(user.email!.toLowerCase());
        }
    });

    it('should delete users', async () => {
        const users = Array(10).fill(createUserFactory());
        await Promise.allSettled(
            users.map((user) => userService.delete(user.id)),
        );
        const findedUsers = await userService.find();
        expect(findedUsers).toHaveLength(0);
    });

    it('should throw an not found error', async () => {
        const user = createUserFactory();
        const result = await userService.findUserById(user.id);
        expect(result).toBeInstanceOf(NotFoundException);
    });
});
