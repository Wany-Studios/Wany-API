import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ROLES_KEY } from '../../helpers/auth/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Role, UserEntity } from '../../entities/user.entity';
import { DataSource } from 'typeorm';
import { JwtData } from './auth.service';
import * as jwt from 'jsonwebtoken';
import environment from '../../environment';
import { throwErrorOrContinue } from '../../utils';

@Injectable()
export class EnsureAuthGuard implements CanActivate {
    constructor(private readonly dataSource: DataSource) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const token = req.cookies.token;

        try {
            const payload = jwt.verify(token, environment.secret) as JwtData;

            const user = await this.dataSource
                .getRepository(UserEntity)
                .findOneByOrFail({ id: payload.sub });

            throwErrorOrContinue(user);

            req.user = user;

            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                const res = context.switchToHttp().getResponse<Response>();

                res.clearCookie('token');

                throw new UnauthorizedException(
                    'Session ended. Please log in again.',
                );
            }
            throw new UnauthorizedException('You must be logged.');
        }
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRoles(roles: string[], userRole: string): boolean {
        return roles.some((role) => role === userRole);
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<Role[]>(
            ROLES_KEY,
            context.getHandler(),
        );

        if (roles) {
            const req = context.switchToHttp().getRequest<Request>();
            return this.matchRoles(roles, req.user.role);
        }

        return true;
    }
}
