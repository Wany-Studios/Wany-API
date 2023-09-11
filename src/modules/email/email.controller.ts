import { Body, Controller, Post } from '@nestjs/common';
import { ResendEmailDto } from '../../dtos/resend-email.dto';
import { validateOrReject } from 'class-validator';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { UserService } from '../user/user.service';
import { throwErrorOrContinue } from '../../utils';
import { randomUUID } from 'node:crypto';
import { EmailService } from './email.service';
import { EmailConfirmationEntity } from '../../entities/email-confirmation.entity';
import { UserSituation } from '../../entities/user.entity';

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
    ) {}

    @Post('/resend-verification-email')
    async resendConfirmationEmail(
        @Body() data: ResendEmailDto,
    ): Promise<{ message: string }> {
        await validateOrReject(data);

        const user = await this.userService.findUserByEmail(data.email);

        throwErrorOrContinue(user);

        if ((user.situation! & UserSituation.NotVerified) === 0) {
            return {
                message: 'Your account is already verified',
            };
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
            message:
                'An account verification email was sent to your email address. Please, verify.',
        };
    }
}
