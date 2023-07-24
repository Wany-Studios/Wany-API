import { Request } from 'express';

export function getBaseUrl(req: Request) {
    return `${req.protocol}://${req.get('host')}`;
}