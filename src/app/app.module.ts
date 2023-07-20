import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    EmailModule
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule { }
