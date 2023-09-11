import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Role, UserEntity } from '../../entities/user.entity';
import { UserService } from '../user/user.service';
import { HashService } from '../../services/hash.service';
import { isError } from '../../utils';
import {
    ResetPasswordEntity,
    ResetPasswordRepository,
} from '../../entities/reset-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult } from 'typeorm';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import environment from '../../environment';

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
        @InjectRepository(ResetPasswordEntity)
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

    async signIn(user: UserEntity, res: Response) {
        const payload: JwtData = {
            sub: user.id,
            email: user.email!,
            role: user.role!,
            username: user.username!,
            isVerified: false,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
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
        ResetPasswordEntity | BadRequestException | InternalServerErrorException
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
            ResetPasswordEntity,
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
