import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Role, User, UserSituation } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { UserService } from '../user/user.service';
import { throwIfIsError } from '../../utils';
import { EmailConfirmationService } from '../email/email-confirmation/email-confirmation.service';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';

// TODO: https://stackoverflow.com/questions/55366037/inject-typeorm-repository-into-nestjs-service-for-mock-data-testing
describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let moduleRef: TestingModule;
    let emailConfirmationService: EmailConfirmationService;

    const generateUserData = (): User => {
        const firstName = faker.person.firstName();
        const user: User = {
            id: faker.string.uuid(),
            username: faker.internet.userName({ firstName }),
            email: faker.internet.email({ firstName }),
            avatar: faker.internet.avatar(),
            password: faker.internet.password({ length: 25 }),
            birth_date: faker.date.birthdate(),
            created_at: faker.date.recent(),
            role: Role.User,
            situation: UserSituation.None,
            updated_at: faker.date.recent(),
        };
        return user;
    };

    const generateEmailConfirmationData = (
        token: string,
        user: User,
    ): EmailConfirmation => {
        const emailConfirmation: EmailConfirmation = {
            id: faker.string.uuid(),
            email: user.email!,
            token,
            used: false,
            user_id: user.id,
            created_at: faker.date.recent(),
            updated_at: faker.date.recent(),
            user: user!,
        };
        return emailConfirmation;
    };

    beforeEach(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    dropSchema: true,
                    entities: [User],
                    synchronize: true,
                    logging: false,
                    name: 'test',
                }),
            ],
            providers: [AuthService, UserService, EmailConfirmationService],
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        userService = moduleRef.get<UserService>(UserService);
        emailConfirmationService = moduleRef.get<EmailConfirmationService>(
            EmailConfirmationService,
        );
    });

    afterEach(async () => {
        await moduleRef.close();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('validate user credentials', () => {
        it('should return user data by username', async () => {
            const u = generateUserData();
            expect(await userService.create(u)).not.toBe(Error);
            expect(
                await authService.validateUserByCredentials(
                    u.username!,
                    u.password!,
                ),
            ).toBe(User);
        });

        it('should return user data by email', async () => {
            const u = generateUserData();
            expect(await userService.create(u)).not.toBe(Error);
            expect(
                await authService.validateUserByCredentials(
                    u.email!,
                    u.password!,
                ),
            ).toBe(User);
        });
    });

    it('it should find reset-password token', async () => {
        const u = generateUserData();
        const token = emailConfirmationService.generateToken();
        const emailConfirmation = generateEmailConfirmationData(token, u);

        expect(await userService.create(u)).not.toBe(Error);

        expect(
            await emailConfirmationService.createEmailConfirmation(
                emailConfirmation,
            ),
        ).not.toBe(Error);

        expect(await authService.findResetPasswordByToken(token)).not.toBe(
            Error,
        );
    });
});
