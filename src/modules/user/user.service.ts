import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { User, UserRepository } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../../services/hash.service';
import { InsertResult } from 'typeorm';
import { isError } from '../../utils';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: UserRepository,
        private hashService: HashService,
    ) {}

    async update(
        userId: string,
        userDataToUpdate: Omit<User, 'id'>,
    ): Promise<User | NotFoundException> {
        try {
            if (isError(await this.findUserById(userId!))) {
                return new NotFoundException('User does not exist');
            }

            return await this.userRepository.save({
                ...userDataToUpdate,
                id: userId,
            });
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async create(
        user: User,
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
                ...user!,
                password: await this.hashService.hashPassword(user.password!),
            });
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async find(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findUserById(
        id: string,
    ): Promise<
        | User
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
        | User
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
        | User
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
        | User
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
