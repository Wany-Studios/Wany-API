import {
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
    Body,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { EnsureAuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import {
    CriticalException,
    is,
    isError,
    throwErrorOrContinue,
} from '../../utils';
import { Role, UserSituation } from '../../entities/user.entity';
import { randomUUID } from 'crypto';
import { EmailService } from '../email/email.service';
import { EmailConfirmationEntity } from '../../entities/email-confirmation.entity';
import { EmailConfirmationService } from '../email/email-confirmation/email-confirmation.service';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { TokenService } from '../../services/token.service';
import { ResetPasswordFormDto } from '../../dtos/reset-password-form.dto';
import { HashService } from '../../services/hash.service';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthenticateDto } from '../../dtos/authenticate.dto';
import { ForgotPasswordDto } from '../../dtos/forgot-password.dto';

@ApiTags('auth')
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

    @ApiCreatedResponse({
        description: 'The account is created. Returns a success message.',
    })
    @Post('/signup')
    @UsePipes(new ValidationPipe())
    async register(@Body() data: CreateUserDto): Promise<{ message: string }> {
        const { dateOfBirth, email, password, username } = data;

        const result = await this.userService.create({
            id: randomUUID(),
            username,
            email,
            password,
            birth_date: dateOfBirth,
            role: Role.User,
        });

        throwErrorOrContinue(result);

        const user = await this.userService.findUserByUsername(data.username);

        if (isError(user)) {
            if (is(user, NotFoundException)) {
                throw new CriticalException(
                    'A critical error has occurred. Your account seems to be created, but apparently something went wrong. Please report this to the Wany team.',
                );
            }

            throw user;
        }

        /*
         * generate email confirmation token,
         * save in database and then send in the user email
         */
        const emailConfirmation: EmailConfirmationEntity = {
            id: randomUUID(),
            email: user.email!,
            token: this.emailConfirmationService.generateToken(),
            used: false,
            user_id: user.id!,
        };

        throwErrorOrContinue(
            await this.emailConfirmationService.createEmailConfirmation(
                emailConfirmation,
            ),
        );
        throwErrorOrContinue(
            await this.emailService.sendConfirmationEmail(
                user,
                emailConfirmation,
            ),
        );

        return {
            message: 'Your account was created successfully',
        };
    }

    @ApiOkResponse({
        description: 'Account sucessfully verified. Returns a success message.',
    })
    @UseGuards(EnsureAuthGuard)
    @Post('/email/verification')
    async verifyEmailConfirmationToken(
        @Req() req: Request,
        @Query('token') token: string,
    ): Promise<{ message: string }> {
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

        throwErrorOrContinue(
            await this.emailConfirmationService.markEmailConfirmationTokenAsUsed(
                emailConfirmation.id,
            ),
        );

        const newUserSituationWithoutNotVerified =
            user.situation! ^ UserSituation.NotVerified; // removing not verified

        throwErrorOrContinue(
            this.userService.update(user.id, {
                situation: newUserSituationWithoutNotVerified,
            }),
        );

        throwErrorOrContinue(
            await this.emailService.sendWelcomeNewUserEmail(user),
        );

        try {
            req.user.situation = newUserSituationWithoutNotVerified;
        } catch (e) {}

        return {
            message: 'Email verified successfully',
        };
    }

    @ApiOkResponse({
        description:
            'An token is sent to user email. Returns an information message.',
    })
    @Post('/forgot-password')
    @UsePipes(new ValidationPipe())
    async forgotPassword(
        @Body() { email }: ForgotPasswordDto,
    ): Promise<{ message: string }> {
        const user = await this.userService.findUserByEmail(email);

        if (isError(user)) throw user;

        const token = this.tokenService.generateResetPasswordToken();
        const result = await this.authService.createResetPasswordToken({
            user_id: user.id,
            token,
            used: false,
        });

        if (isError(result)) throw result;

        throwErrorOrContinue(
            await this.emailService.sendResetPasswordTokenEmail(user, token),
        );

        return {
            message: 'An email was sent to your email address. Please, verify.',
        };
    }

    @ApiOkResponse({
        description:
            'The user password was recovered. Returns a success message.',
    })
    @Get('/reset-password')
    @UsePipes(new ValidationPipe())
    async resetPassword(
        @Query('token') token: string,
        @Query('email') email: string,
    ) {
        try {
            const resetPassword =
                await this.authService.findResetPasswordByToken(token);

            throwErrorOrContinue(resetPassword);

            const user = await this.userService.findUserById(
                resetPassword.user_id,
            );

            throwErrorOrContinue(user);

            if (user.email !== email) {
                throw new UnauthorizedException('Wrong email address');
            }

            if (resetPassword.used || resetPassword.is_expired) {
                throw new UnauthorizedException('This token is expired');
            }

            throwErrorOrContinue(
                await this.authService.markResetPasswordAsUsed(
                    resetPassword.id,
                ),
            );

            const newPassword = this.tokenService.generatePassword();

            throwErrorOrContinue(
                await this.userService.update(user.id, {
                    password: await this.hashService.hashPassword(newPassword),
                }),
            );

            const emailResult = await this.emailService.sendNewPasswordEmail(
                user,
                newPassword,
            );

            if (isError(emailResult)) {
                return "We couldn't send the email. Please, try again.";
            }

            return 'A new password was sent to your email address.';
        } catch (err) {
            return `Failed to reset password: ${err.message}`;
        }
    }

    @ApiOkResponse({
        description:
            'The user password was recovered. Returns a success message.',
    })
    @Put('/form-reset-password')
    @UsePipes(new ValidationPipe())
    async resetPasswordForm(
        @Body() payload: ResetPasswordFormDto,
    ): Promise<{ message: string }> {
        const resetPassword = await this.authService.findResetPasswordByToken(
            payload.token,
        );

        if (isError(resetPassword)) throw resetPassword;

        const user = await this.userService.findUserById(resetPassword.user_id);
        throwErrorOrContinue(user);

        if (user.email !== payload.email) {
            throw new BadRequestException('Wrong email address');
        }

        if (resetPassword.used || resetPassword.is_expired) {
            throw new UnauthorizedException('This token is expired');
        }

        throwErrorOrContinue(
            await this.authService.markResetPasswordAsUsed(resetPassword.id),
        );

        await this.userService.update(user.id, {
            password: await this.hashService.hashPassword(payload.newPassword),
        });

        return {
            message: 'Your password changed successfully',
        };
    }

    @Post('/signin')
    async login(
        @Body() { usernameOrEmail, password }: AuthenticateDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ message: string }> {
        const user = await this.authService.validateUserCredentials(
            usernameOrEmail,
            password,
        );

        throwErrorOrContinue(user);
        await this.authService.signIn(user, res);
        return { message: 'You are logged' };
    }

    @Get('/logout')
    async logout(
        @Res({ passthrough: true }) res: any,
    ): Promise<{ message: string }> {
        res.clearCookie('token');
        return { message: 'Session ended' };
    }
}
