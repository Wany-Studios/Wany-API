import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Role, UserEntity, UserSituation } from './entities/user.entity';

export const createUserFactory = (user?: Partial<UserEntity>): UserEntity => {
    const defaultUser: UserEntity = {
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
    return { ...defaultUser, ...user } as UserEntity;
};

export const seedTestingDatabase = async (dataSource: DataSource) => {
    const userRepo = dataSource.getRepository(UserEntity);
    const createdUsers = [];

    for (let i = 0; i < 10; i++) {
        const user = createUserFactory();
        await userRepo.save(user);
        createdUsers.push(user);
    }

    return {
        createdUsers,
    };
};
