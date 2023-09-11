import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { EmailConfirmationEntity } from '../../entities/email-confirmation.entity';
import { ResetPasswordEntity } from '../../entities/reset-password.entity';
import config from './database.config';
import { GameEntity } from '../../entities/game.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([UserEntity]),
        TypeOrmModule.forFeature([EmailConfirmationEntity]),
        TypeOrmModule.forFeature([ResetPasswordEntity]),
        TypeOrmModule.forFeature([GameEntity]),
    ],
    exports: [TypeOrmModule],
    providers: [],
})
export class DatabaseModule {}
