import { Strategy as LocalStrategy } from 'passport-local';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PassportSerializer, PassportStrategy } from '@nestjs/passport';
import { Role, User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';
import { HashService } from '../../services/hash.service';
import { isError } from '../../utils';
import {
    ResetPassword,
    ResetPasswordRepository,
} from '../../entities/reset-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult } from 'typeorm';
import { randomUUID } from 'crypto';

export interface JwtData {
    sub: string;
    username: string;
    role: Role;
    email: string;
    isVerified: boolean;
    exp: number; // expiration time in seconds
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly hashService: HashService,
        @InjectRepository(ResetPassword)
        private readonly resetPasswordRepository: ResetPasswordRepository,
    ) {}

    async validateUserByCredentials(usernameOrEmail: string, password: string) {
        const user = await this.userService.findUserByUsernameOrEmail(
            usernameOrEmail,
        );
        if (isError(user)) return user;

        const passwordEqual = await this.hashService.comparePassword(
            password,
            user.password!,
        );
        if (!passwordEqual)
            return new BadRequestException('Password is incorrect');

        return user;
    }

    async findResetPasswordByToken(
        token: string,
    ): Promise<
        ResetPassword | BadRequestException | InternalServerErrorException
    > {
        try {
            const resetPassword = await this.resetPasswordRepository.findOneBy({
                token,
            });

            if (!resetPassword) return new BadRequestException('Invalid token');

            return resetPassword;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async markResetPasswordAsUsed(
        resetPasswordId: string,
    ): Promise<null | NotFoundException | InternalServerErrorException> {
        try {
            if (
                !(await this.resetPasswordRepository.exist({
                    where: { id: resetPasswordId },
                }))
            ) {
                return new NotFoundException('Reset password not found');
            }

            await this.resetPasswordRepository.save({
                id: resetPasswordId,
                used: true,
            });

            return null;
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }

    async createResetPasswordToken(
        resetPasswordData: Omit<
            ResetPassword,
            | 'id'
            | 'setExpirationTime'
            | 'checkExpirationTime'
            | 'is_expired'
            | 'expires_at'
        >,
    ): Promise<InsertResult | InternalServerErrorException> {
        try {
            const resetPassword = this.resetPasswordRepository.create({
                ...resetPasswordData,
                id: randomUUID(),
                used: false,
            });
            return await this.resetPasswordRepository.insert(resetPassword);
        } catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }
}

@Injectable()
export class LocalStrategyService extends PassportStrategy(LocalStrategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'usernameOrEmail' });
    }

    async validate(
        usernameOrEmail: string,
        password: string,
    ): Promise<User | null> {
        const user = await this.authService.validateUserByCredentials(
            usernameOrEmail,
            password,
        );
        if (isError(user)) throw user;
        return user;
    }
}

@Injectable()
export class SessionSerializerService extends PassportSerializer {
    serializeUser(
        user: any,
        done: (err: Error | null, user: any) => void,
    ): any {
        done(null, user);
    }
    deserializeUser(
        payload: any,
        done: (err: Error | null, payload: string) => void,
    ): any {
        done(null, payload);
    }
}
