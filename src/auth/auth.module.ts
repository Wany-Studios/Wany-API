import { Module } from '@nestjs/common';
import { AuthService, LocalStrategyService, SessionSerializerService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashService } from '../user/hash/hash.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ session: true }),
        EmailModule
    ],
    providers: [AuthService, HashService, SessionSerializerService, LocalStrategyService],
    controllers: [AuthController],
    exports: []
})
export class AuthModule { }
