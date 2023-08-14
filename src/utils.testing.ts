import { faker } from '@faker-js/faker';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import { Role, User, UserSituation } from './entities/user.entity';

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

export const testingDatabaseModule = () => {
    return [
        TypeOrmModule.forRoot({
            type: 'better-sqlite3',
            database: ':memory:',
            dropSchema: true,
            entities: [User],
            synchronize: true
        }),
        TypeOrmModule.forFeature([User])
    ]
};

export const seedTestingDatabase = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(User);
    const createdUsers = [];

    for (let i = 0; i < 10; i++) {
        const user = createUserFactory();
        await userRepo.save(user);
        createdUsers.push(user);
    }

    return {
        createdUsers
    }
}