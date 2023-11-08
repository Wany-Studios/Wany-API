import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { DatabaseModule } from '../database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { GameMapper } from '../../mapper/game-mapper';
import { UserModule } from '../user/user.module';
import { ZipService } from '../../services/zip.service';
import environment from '../../environment';
import { GameImageMapper } from '../../mapper/game-image-mapper';

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        MulterModule.register({
            preservePath: true,
            storage: diskStorage({
                destination: environment.upload.gamesPath,
                filename(req, file, cb) {
                    return cb(
                        null,
                        `${randomUUID()}-${randomUUID()}-${file.originalname}`,
                    );
                },
            }),
        }),
    ],
    providers: [GameService, GameMapper, GameImageMapper, ZipService],
    controllers: [GameController],
    exports: [GameService],
})
export class GameModule {}
