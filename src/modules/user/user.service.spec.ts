import { Test, TestingModule } from '@nestjs/testing';
import {testingDatabaseModule, createUserFactory, seedTestingDatabase} from "../../utils.testing";
import { UserService } from '../../modules/user/user.service';
import { HashService } from '../../services/hash.service';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...testingDatabaseModule()],
            providers: [HashService, UserService],
        }).compile();

        userService = module.get<UserService>(UserService);

        await seedTestingDatabase();
    });

    // beforeEach(async () => {
    //     await TransactionalTestContext.start();
    // });

    // afterEach(async () => {
    //     await TransactionalTestContext.finish();
    // });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    // it('should create a user', async () => {
    //     const createUser = createUserFactory();
    //     expect(await userService.create(createUser)).not.toBe(Error);

    //     const user = await userService.findUserById(createUser.id);

    //     expect(user).not.toBe(Error);

    //     if (isError(user)) return;

    //     expect(user.username).toEqual(createUser.username);
    //     expect(user.email).toEqual(createUser.email);
    // });
});
