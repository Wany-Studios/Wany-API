import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { getRoutes } from '../../helpers/get-routes.helper';

@Controller()
export class AppController {
    @Get('/healthcheck')
    getStatus(): number {
        return 200;
    }

    @Get()
    info(@Req() req: Request) {
        return getRoutes(req);
    }
}
