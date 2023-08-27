import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';
import { ResetPassword } from '../../entities/reset-password.entity';
import config from './database.config';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([EmailConfirmation]),
        TypeOrmModule.forFeature([ResetPassword]),
    ],
    exports: [TypeOrmModule],
    providers: [],
})
export class DatabaseModule {}
