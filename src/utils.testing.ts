import { faker } from '@faker-js/faker';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Role, User, UserSituation } from './entities/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const createUserFactory = (user?: Partial<User>): User => {
    const defaultUser: User = {
        id: faker.string.uuid(),
        email: faker.internet.email({}),
        username: faker.internet.userName({}),
        password: faker.internet.password({}),
        created_at: new Date(),
        avatar: faker.internet.avatar(),
        role: Role.User,
        situation: UserSituation.None,
        updated_at: new Date(),
        birth_date: faker.date.between({
            from: new Date('1970-01-01'),
            to: new Date(),
        }),
    };
    return { ...defaultUser, ...user } as User;
};

const mongoInstanceManager = (() => {
    let _mongo: null | MongoMemoryServer = null;

    return {
        async connect() {
            await this.disconnect();
            _mongo = new MongoMemoryServer();
        },
        async disconnect() {
            if (_mongo !== null) {
                await _mongo.stop();
            }
        },
        get instance(): Promise<MongoMemoryServer> {
            return new Promise(async (resolve) => {
                if (_mongo === null) await this.connect();
                return resolve(_mongo!);
            });
        },
    };
})();

export const mongoTestingModule = (options: MongooseModuleOptions = {}) =>
    MongooseModule.forRootAsync({
        async useFactory() {
            return {
                uri: (await mongoInstanceManager.instance).getUri(),
                ...options,
            };
        },
    });

export const closeMongoConnection = async () => {
    await mongoInstanceManager.disconnect();
};

export const getMongooseFeatures = () => {
    return MongooseModule.forFeature([
        {
            name: 'User',
            schema: User,
        },
    ]);
};
