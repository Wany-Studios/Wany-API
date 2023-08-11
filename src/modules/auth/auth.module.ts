import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { HashService } from '../../services/hash.service';
import { TokenService } from '../../services/token.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import environment from '../../environment';

@Module({
    imports: [
        JwtModule.register({
            secret: environment.secret,
            signOptions: { expiresIn: '1h' },
        }),
        UserModule,
        EmailModule,
        DatabaseModule,
    ],
    providers: [AuthService, HashService, TokenService, JwtService],
    controllers: [AuthController],
    exports: [],
})
export class AuthModule {}
