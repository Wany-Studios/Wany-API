import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { MailerModule } from '@nestjs-modules/mailer';
import environment from '../../environment';

// TODO: verificar pq email não está sendo enviado
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: environment.mail.host,
        port: environment.mail.port,
        auth: {
          user: environment.mail.auth.user,
          pass: environment.mail.auth.pass,
        },
        secure: environment.secure,
        service: environment.mail.service,
      }
    }),
    EmailConfirmationModule
  ],
  providers: [EmailService],
  exports: [EmailService, EmailConfirmationModule]
})
export class EmailModule { }
