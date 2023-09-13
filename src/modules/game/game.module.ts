import { BadRequestException, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DatabaseModule } from '../database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileFilterCallback, diskStorage } from 'multer';
import environment from '../../environment';
import { randomUUID } from 'node:crypto';
import { GameMapper } from '../../mapper/game-mapper';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        MulterModule.register({
            preservePath: true,
            fileFilter: (
                req: Express.Request,
                file: Express.Multer.File,
                cb: FileFilterCallback,
            ) => {
                const error = new BadRequestException(
                    'Only zip files are allowed',
                );
                if (file.mimetype === 'application/zip') {
                    cb(null, true);
                } else {
                    cb(error);
                }
            },
            storage: diskStorage({
                destination: environment.upload.avatarPath,
                filename(req, file, cb) {
                    return cb(
                        null,
                        `${randomUUID()}-${randomUUID()}-${file.originalname}`,
                    );
                },
            }),
        }),
    ],
    providers: [GameService, GameMapper],
    controllers: [GameController],
    exports: [GameService],
})
export class GameModule {}
