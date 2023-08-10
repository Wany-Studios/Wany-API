import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import environment from 'src/environment';

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
        private jwtService: JwtService,
    ) {}

    async validateUserCredentials(usernameOrEmail: string, password: string) {
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

    async signIn(user: User, res: Response) {
        const payload = {
            sub: user.id,
            email: user.email!,
            role: user.role!,
            username: user.username!,
            isVerified: false,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: environment.secret,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: environment.secure,
        });
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
