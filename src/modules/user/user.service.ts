import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { UserEntity, UserRepository } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../../services/hash.service';
import { DeleteResult, InsertResult } from 'typeorm';
import { isError } from '../../utils';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: UserRepository,
        private hashService: HashService,
    ) {}

    async update(
        userId: string,
        userDataToUpdate: Omit<UserEntity, 'id'>,
    ): Promise<UserEntity | NotFoundException> {
        try {
            if (isError(await this.findUserById(userId!))) {
                return new NotFoundException('User does not exist');
            }

            const updatedData = await this.userRepository.save({
                birth_date: userDataToUpdate.birth_date ?? undefined,
                bio: userDataToUpdate.bio?.trim() ?? undefined,
                username: userDataToUpdate.username?.toLowerCase() ?? undefined,
                email: userDataToUpdate.email?.toLowerCase() ?? undefined,
                password: userDataToUpdate.password
                    ? await this.hashService.hashPassword(
                          userDataToUpdate.password!,
                      )
                    : undefined,
                id: userId,
            });

            return updatedData as UserEntity;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async create(
        user: UserEntity,
    ): Promise<
        InsertResult | InternalServerErrorException | BadRequestException
    > {
        try {
            if (!isError(await this.findUserById(user.id!))) {
                throw new Error('User id is already being used');
            }

            if (!isError(await this.findUserByUsername(user.username!))) {
                return new BadRequestException(
                    `Username ${user.username} is already being used`,
                );
            }

            if (!isError(await this.findUserByEmail(user.email!))) {
                return new BadRequestException(
                    `Email ${user.email} is already registered`,
                );
            }

            return await this.userRepository.insert({
                ...user,
                username: user.username!.toLocaleLowerCase(),
                email: user.email!.toLocaleLowerCase(),
                password: await this.hashService.hashPassword(user.password!),
            });
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async find(): Promise<UserEntity[]> {
        return await this.userRepository.find({ cache: true });
    }

    async delete(userId: string): Promise<DeleteResult> {
        return await this.userRepository.delete(userId);
    }

    async getUserAvatarByUsername(
        username: string,
    ): Promise<string | undefined | NotFoundException> {
        const user = await this.userRepository.findOneBy({ username });
        if (!user) return new NotFoundException('User not found');
        return user.avatar;
    }

    async findUserById(
        id: string,
    ): Promise<
        | UserEntity
        | NotFoundException
        | InternalServerErrorException
        | BadRequestException
    > {
        try {
            if (!id) return new BadRequestException('User ID must be provided');
            const user = await this.userRepository.findOneBy({ id });
            if (!user) return new NotFoundException('User not found');
            return user;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async findUserByUsername(
        username: string,
    ): Promise<
        | UserEntity
        | NotFoundException
        | InternalServerErrorException
        | BadRequestException
    > {
        try {
            if (!username)
                return new BadRequestException('Username must be provided');
            const user = await this.userRepository.findOneBy({ username });
            if (!user) return new NotFoundException('User not found');
            return user;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async findUserByEmail(
        email: string,
    ): Promise<
        | UserEntity
        | NotFoundException
        | InternalServerErrorException
        | BadRequestException
    > {
        try {
            if (!email)
                return new BadRequestException('Email must be provided');
            const user = await this.userRepository.findOneBy({ email });
            if (!user) return new NotFoundException('User not found');
            return user;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async findUserByUsernameOrEmail(
        usernameOrEmail: string,
    ): Promise<
        | UserEntity
        | NotFoundException
        | InternalServerErrorException
        | BadRequestException
    > {
        try {
            if (!usernameOrEmail)
                return new BadRequestException(
                    'Username or email must be provided',
                );
            const user = await this.userRepository.findOneBy([
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ]);
            if (!user) return new NotFoundException('User not found');
            return user;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }
}
