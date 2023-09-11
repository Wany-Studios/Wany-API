import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { GameModule } from '../game/game.module';

@Module({
    imports: [UserModule, AuthModule, EmailModule, GameModule],
    providers: [],
    controllers: [AppController],
})
export class AppModule {}
