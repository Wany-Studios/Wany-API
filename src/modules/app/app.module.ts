import { AppController } from './app.controller';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GameModule } from '../game/game.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import environment from '../../environment';
import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Module({
    imports: [
        UserModule,
        AuthModule,
        EmailModule,
        GameModule,
        ServeStaticModule.forRoot({
            rootPath: environment.public.rootPath,
            serveRoot: '/public',
        }),
    ],
    providers: [HttpAdapterHost],
    controllers: [AppController],
    exports: [ServeStaticModule],
})
export class AppModule {}
