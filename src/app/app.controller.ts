import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { EnsureIsAuthenticatedGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get('/healthcheck')
  getStatus(): number {
    return 200;
  }
}
