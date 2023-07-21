import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { HashService } from '../../services/hash.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService, HashService],
    exports: [UserService],
})
export class UserModule {}
