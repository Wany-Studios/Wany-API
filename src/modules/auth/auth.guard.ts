import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Role, User } from '../../entities/user.entity';
import { ROLES_KEY } from '../../helpers/auth/roles.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        await super.logIn(context.switchToHttp().getRequest<Request>());
        return result;
    }
}

@Injectable()
export class EnsureIsAuthenticatedGuard implements CanActivate {
    constructor(private readonly dataSource: DataSource) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();

        if (req.isAuthenticated()) {
            req.user = await this.dataSource
                .getRepository(User)
                .findOneByOrFail({ id: req.user.id });

            return true;
        }

        throw new UnauthorizedException('You must be logged.');
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    matchRoles(roles: string[], userRole: string) {
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
