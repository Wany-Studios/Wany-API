import environment from '../environment';
import * as Unzipper from 'adm-zip';
import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createFolder, throwErrorOrContinue } from '../utils';

@Injectable()
export class ZipService {
    async unzipToGamesPublicFolder(zipPath: string): Promise<string | Error> {
        const unzipper = new Unzipper(zipPath);
        const id = `${randomUUID()}${randomUUID()}`;
        const publicFolder = join(environment.public.gamesPath, id);

        throwErrorOrContinue(await createFolder(publicFolder));

        return await new Promise((resolve) => {
            unzipper.extractAllToAsync(publicFolder, false, false, (error) => {
                return !error ? resolve(id) : resolve(error);
            });
        });
    }
}
