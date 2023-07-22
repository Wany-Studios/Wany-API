import { User as UserModel } from '../../src/entities/user.entity';

declare module 'express-serve-static-core' {
    export interface Request {
        user: UserModel;
    }
}
