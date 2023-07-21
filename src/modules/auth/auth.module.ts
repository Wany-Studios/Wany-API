import { Module } from '@nestjs/common';
import {
    AuthService,
    LocalStrategyService,
    SessionSerializerService,
} from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { HashService } from '../../services/hash.service';

@Module({
    imports: [
        UserModule,
        PassportModule.register({ session: true }),
        EmailModule,
    ],
    providers: [
        AuthService,
        HashService,
        SessionSerializerService,
        LocalStrategyService,
    ],
    controllers: [AuthController],
    exports: [],
})
export class AuthModule {}
