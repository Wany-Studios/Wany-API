import { User as UserModel } from '../../entities/user.entity';

declare global {
    declare namespace Express {
        type User = UserModel;
    }
}
