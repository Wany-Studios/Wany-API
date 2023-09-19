import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from '../../dtos/create-game.dto';
import { EnsureAuthGuard } from '../auth/auth.guard';
import { GameService } from './game.service';
import { Game } from '../models/game';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    createFolder,
    deleteFile,
    deleteFolder,
    isError,
    throwErrorOrContinue,
} from '../../utils';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { Role } from '../../entities/user.entity';
import { GameMapper } from '../../mapper/game-mapper';
import { randomUUID } from 'crypto';
import { join } from 'node:path';
import environment from '../../environment';
import * as unzipper from 'unzipper';
import * as fs from 'fs';

@ApiTags('game')
@Controller('game')
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly userService: UserService,
        private readonly gameMapper: GameMapper,
    ) {}

    @ApiCreatedResponse({
        description: 'Create a game. Returns a success message.',
    })
    @UseGuards(EnsureAuthGuard)
    @Post('/create')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new ValidationPipe())
    @ApiConsumes('multipart/form-data')
    async create(
        @Req() req: Request,
        @Body() data: CreateGameDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ message: string; game: Game }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const { description, genre, title } = data;
        const { path: gameZipPath } = file;

        const publicFolderPath = join(
            environment.public.gamesPath,
            `${randomUUID()}${randomUUID()}`,
        );

        throwErrorOrContinue(await createFolder(publicFolderPath));

        await fs
            .createReadStream(gameZipPath)
            .pipe(unzipper.Extract({ path: publicFolderPath, concurrency: 5 }))
            .promise();

        const game = new Game({
            description,
            genre,
            title,
            gamePath: publicFolderPath,
            userId: req.user.id!,
        });

        const result = await this.gameService.create(game);

        await deleteFile(gameZipPath);

        if (isError(result)) {
            await deleteFolder(publicFolderPath);
            throw result;
        }

        return {
            message: `The game "${title}" was created sucessfully.`,
            game: this.gameMapper.toHTTP(game),
        };
    }

    @ApiCreatedResponse({
        description: 'Delete a game. Returns a success message.',
    })
    @UseGuards(EnsureAuthGuard)
    @Delete('/delete/:id')
    async delete(
        @Param('id') gameId: string,
        @Req() req: Request,
    ): Promise<{ message: string }> {
        const game = await this.gameService.getGameById(gameId);
        const currentUser = await this.userService.findUserById(req.user.id);

        if (isError(currentUser)) throw currentUser;
        if (isError(game)) throw game;

        if (currentUser.role !== Role.Admin && game.userId !== req.user.id) {
            throw new UnauthorizedException(
                "You don't have permission to delete this game",
            );
        }

        await deleteFile(game.gamePath);
        await this.gameService.delete(game.id);
        return {
            message: 'Game deleted sucessfully',
        };
    }

    @Get('/public')
    async search(): Promise<{ games: Game[] }> {
        const games = await this.gameService.find();

        return {
            games: games.map((game) => this.gameMapper.toHTTP(game)),
        };
    }
}
