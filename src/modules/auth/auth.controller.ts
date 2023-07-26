import {
    Body,
    Controller,
    Post,
    UseGuards,
    Req,
    Get,
    NotFoundException,
    BadRequestException,
    Query,
    Put,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { validateOrReject } from 'class-validator';
import { EnsureIsAuthenticatedGuard, LocalAuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import { CriticalException, is, isError, throwIfIsError } from '../../utils';
import { Role, UserSituation } from '../../entities/user.entity';
import { randomUUID } from 'crypto';
import { EmailService } from '../email/email.service';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';
import { EmailConfirmationService } from '../email/email-confirmation/email-confirmation.service';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from '../../services/token.service';
import { ResetPasswordDto } from '../../dtos/reset-password.dto';
import { HashService } from '../../services/hash.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly hashService: HashService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly tokenService: TokenService,
    ) {}

    @Post('/signup')
    async register(@Body() data: CreateUserDto): Promise<any> {
        await validateOrReject(data);

        const { dateOfBirth, email, password, username } = data;

        const result = await this.userService.create({
            id: randomUUID(),
            username,
            email,
            password,
            birth_date: dateOfBirth,
            role: Role.User,
        });

        if (isError(result)) throw result;

        const user = await this.userService.findUserByUsername(data.username);

        if (isError(user)) {
            if (is(user, NotFoundException)) {
                throw new CriticalException(
                    'A critical error has occurred. Your account seems to have been created, but apparently something went wrong. Please report this to the Wany team.',
                );
            }

            throw user;
        }

        /*
         * generate email confirmation token,
         * save in database and then send in the user email
         */
        const emailConfirmation: EmailConfirmation = {
            id: randomUUID(),
            email: user.email!,
            token: this.emailConfirmationService.generateToken(),
            used: false,
            user_id: user.id!,
        };

        throwIfIsError(
            await this.emailConfirmationService.createEmailConfirmation(
                emailConfirmation,
            ),
        );
        throwIfIsError(
            await this.emailService.sendConfirmationEmail(
                user,
                emailConfirmation,
            ),
        );

        return {
            message: 'Your account has been created successfully',
        };
    }

    @UseGuards(EnsureIsAuthenticatedGuard)
    @Post('/email/verification')
    async verifyEmailConfirmationToken(
        @Req() req: Request,
        @Query('token') token: string,
    ) {
        const user = await this.userService.findUserById(req.user!.id);
        if (isError(user)) throw user;

        if ((user.situation! & UserSituation.NotVerified) === 0) {
            return {
                message: 'Your account is already verified',
            };
        }

        const emailConfirmation =
            await this.emailConfirmationService.findEmailConfirmationWithToken(
                token,
            );
        if (isError(emailConfirmation)) throw emailConfirmation;

        if (emailConfirmation.user_id !== user.id) {
            throw new BadRequestException('Invalid email confirmation token');
        }

        if (emailConfirmation.used) {
            throw new BadRequestException('This token is already used');
        }

        throwIfIsError(
            await this.emailConfirmationService.markEmailConfirmationTokenAsUsed(
                emailConfirmation.id,
            ),
        );

        const newUserSituationWithoutNotVerified =
            user.situation! ^ UserSituation.NotVerified; // removing not verified

        throwIfIsError(
            this.userService.update(user.id, {
                situation: newUserSituationWithoutNotVerified,
            }),
        );

        req.user.situation = newUserSituationWithoutNotVerified;

        return {
            message: 'Email verified successfully',
        };
    }

    @Post('/forgot-password')
    async forgotPassword(@Body('email') email: string) {
        const user = await this.userService.findUserByEmail(email);

        if (isError(user)) throw user;

        const token = this.tokenService.generateResetPasswordToken();
        const result = await this.authService.createResetPasswordToken({
            user_id: user.id,
            token,
            used: false,
        });

        if (isError(result)) throw result;

        throwIfIsError(
            await this.emailService.sendResetPasswordTokenEmail(user, token),
        );

        return {
            message: 'An email has been sent to your email address',
        };
    }

    @Put('/reset-password')
    async resetPassword(
        @Req() req: Request,
        @Body() payload: ResetPasswordDto,
    ) {
        await validateOrReject(payload);

        const resetPassword = await this.authService.findResetPasswordByToken(
            payload.token,
        );

        if (isError(resetPassword)) throw resetPassword;

        const user = await this.userService.findUserById(resetPassword.user_id);
        if (isError(user)) throw user;

        if (user.email !== payload.email) {
            throw new BadRequestException('Wrong email address');
        }

        if (resetPassword.used || resetPassword.is_expired) {
            throw new UnauthorizedException('This token is expired');
        }

        throwIfIsError(
            await this.authService.markResetPasswordAsUsed(resetPassword.id),
        );

        await this.userService.update(user.id, {
            password: await this.hashService.hashPassword(payload.newPassword),
        });

        return {
            message: 'Your password has been changed',
        };
    }

    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async login(): Promise<any> {
        return { message: 'You are logged' };
    }

    @Get('/logout')
    logout(@Req() req: any): any {
        req.session.destroy();
        return { message: 'The user session has ended' };
    }
}
