import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { EmailConfirmationEntity } from '../../entities/email-confirmation.entity';
import { ResetPasswordEntity } from '../../entities/reset-password.entity';
import config from './database.config';
import { GameEntity } from '../../entities/game.entity';
import { GameImageEntity } from '../../entities/game-image.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([UserEntity]),
        TypeOrmModule.forFeature([EmailConfirmationEntity]),
        TypeOrmModule.forFeature([ResetPasswordEntity]),
        TypeOrmModule.forFeature([GameEntity]),
        TypeOrmModule.forFeature([GameImageEntity]),
    ],
    exports: [TypeOrmModule],
    providers: [],
})
export class DatabaseModule {}
