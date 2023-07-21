import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';
import environment from '../../environment';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmationEmail(
        user: User,
        emailCofirmation: EmailConfirmation,
    ) {
        return await this.sendEmail(
            user.email!,
            environment.mail.from,
            'Email Confirmation',
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome to Wany!</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h1>Email confirmation on Wany!</h1>

                <br />

                <p>${user.username!.toUpperCase()}, Your email confirmation token is: ${
                emailCofirmation.token
            }</p>
                <p>Sincerely,</p>

                <p><strong>Wany's Team</strong></p>
            </body>
            </html>
            `,
        );
    }

    async sendWelcomeNewUser(user: User) {
        return await this.sendEmail(
            user.email!,
            environment.mail.from,
            'Welcome to Wany!',
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Welcome to Wany!</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h1>Welcome to Wany, ${user.username!.toUpperCase()}!</h1>

                <br />

                <p>Congratulations on creating your Wany account. We are excited to have you as part of our community of independent game creators.</p>
                <p>At Wany, you have the opportunity to earn money while others play the games you create. We're always looking for exciting new games to add to our platform and we can't wait to see what you have to offer.</p>
                <p>If you have any questions about how Wany works, please consult our FAQ page or contact us directly.</p>
                <p>Thanks for joining Wany and good luck with your game creations!</p>
                <p>Sincerely,</p>

                <p><strong>Wany's Team</strong></p>
            </body>
            </html>
            `,
        );
    }

    private async sendEmail(
        to: string,
        subject: string,
        text: string,
        html: string,
    ): Promise<null | InternalServerErrorException> {
        try {
            const from = environment.mail.from;
            await this.mailerService.sendMail({
                to,
                text,
                html,
                from,
                subject,
            });
            return null;
        } catch (err) {
            return new InternalServerErrorException(
                'Failed to send email',
                err.message,
            );
        }
    }
}
