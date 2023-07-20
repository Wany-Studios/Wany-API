import { Strategy as LocalStrategy } from "passport-local";
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportSerializer, PassportStrategy } from '@nestjs/passport';
import { Role, User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { HashService } from '../user/hash.service';
import { isError } from '../utils';

export interface JwtData {
    sub: string;
    username: string;
    role: Role;
    email: string;
    isVerified: boolean;
    exp: number; // expiration time in seconds
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly hashService: HashService
    ) { }

    async validateUserByCredentials(usernameOrEmail: string, password: string) {
        const user = await this.userService.findUserByUsernameOrEmail(usernameOrEmail);
        if (isError(user)) return user;

        const passwordEqual = await this.hashService.comparePassword(password, user.password!)
        if (!passwordEqual) return new BadRequestException('Password is incorrect');

        return user
    }
}

@Injectable()
export class LocalStrategyService extends PassportStrategy(LocalStrategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'usernameOrEmail' });
    }

    async validate(usernameOrEmail: string, password: string): Promise<User | null> {
        const user = await this.authService.validateUserByCredentials(usernameOrEmail, password);
        if (isError(user)) throw user;
        return user;
    }
}

@Injectable()
export class SessionSerializerService extends PassportSerializer {
    serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
        done(null, user)
    }
    deserializeUser(
        payload: any,
        done: (err: Error | null, payload: string) => void
    ): any {
        done(null, payload)
    }
}
