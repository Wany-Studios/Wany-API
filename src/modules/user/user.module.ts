import { BadRequestException, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { HashService } from '../../services/hash.service';
import { MulterModule } from '@nestjs/platform-express';
import environment from '../../environment';
import { randomUUID } from 'crypto';
import { FileFilterCallback, diskStorage } from 'multer';

@Module({
    imports: [
        DatabaseModule,
        MulterModule.register({
            preservePath: true,
            fileFilter: (
                req: Express.Request,
                file: Express.Multer.File,
                cb: FileFilterCallback,
            ) => {
                const error = new BadRequestException(
                    'Only image files are allowed',
                );
                const [type] = file.mimetype.split('/');
                const isImage = type === 'image';

                if (isImage) {
                    cb(null, true);
                    return;
                }

                return cb(error);
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
    controllers: [UserController],
    providers: [UserService, HashService],
    exports: [UserService],
})
export class UserModule {}
