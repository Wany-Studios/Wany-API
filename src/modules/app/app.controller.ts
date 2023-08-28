import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { getRoutes } from '../../helpers/get-routes.helper';
import { Roles } from '../../helpers/auth/roles.decorator';
import { Role } from '../../entities/user.entity';
import { EnsureAuthGuard, RolesGuard } from '../auth/auth.guard';

@Controller()
export class AppController {
    @Get('/healthcheck')
    getStatus(): number {
        return 200;
    }

    @Roles(Role.Admin)
    @UseGuards(EnsureAuthGuard, RolesGuard)
    @Get('/admin')
    admin() {
        return 200;
    }

    @Get()
    info(@Req() req: Request) {
        return getRoutes();
    }
}
