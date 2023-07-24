import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { HashService } from '../../services/hash.service';
import { MulterModule } from '@nestjs/platform-express';
import environment from '../../environment';
import { randomUUID } from 'crypto';
import path = require('path');
import { diskStorage } from 'multer';

@Module({
    imports: [
        DatabaseModule,
        MulterModule.register({
            preservePath: true,
            storage: diskStorage({
                destination: environment.upload.avatarPath,
                filename(req, file, cb) {
                    const filename =
                        randomUUID() +
                        randomUUID() +
                        path.extname(file.originalname);
                    return cb(null, filename);
                },
            }),
        }),
    ],
    controllers: [UserController],
    providers: [UserService, HashService],
    exports: [UserService],
})
export class UserModule {}
