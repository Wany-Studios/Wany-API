import {
    BadRequestException,
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    ParseFilePipeBuilder,
    ParseIntPipe,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { CreateGameDto } from '../../dtos/create-game.dto';
import { EnsureAuthGuard } from '../auth/auth.guard';
import { GameService } from './game.service';
import { Game } from '../models/game';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    checkFileExists,
    deleteFile,
    deleteFolder,
    isError,
    throwErrorOrContinue,
} from '../../utils';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { Role } from '../../entities/user.entity';
import { GameMapper } from '../../mapper/game-mapper';
import { ZipService } from '../../services/zip.service';
import { join } from 'node:path';
import { GameImage } from '../models/game-image';
import { GameImageMapper } from '../../mapper/game-image-mapper';
import { Response } from 'express';
import environment from '../../environment';
import * as fs from 'fs';
import { CreateGameImageDto } from '../../dtos/create-game-image.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly userService: UserService,
        private readonly gameMapper: GameMapper,
        private readonly gameImageMapper: GameImageMapper,
        private readonly zipService: ZipService,
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
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /.zip/,
                })
                .build(),
        )
        file: Express.Multer.File,
    ): Promise<{ message: string; game: Game }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const { description, genre, title } = data;
        const { path: gameZipPath } = file;

        const gamePathId = await this.zipService.unzipToGamesPublicFolder(
            gameZipPath,
        );

        throwErrorOrContinue(gamePathId);

        const game = new Game({
            description,
            genre,
            title,
            gamePath: gamePathId,
            userId: req.user.id!,
        });

        const result = await this.gameService.create(game);

        await deleteFile(gameZipPath);

        if (isError(result)) {
            await deleteFolder(gamePathId);
            throw result;
        }

        return {
            message: `The game "${title}" was created sucessfully.`,
            game: this.gameMapper.toHTTP(game),
        };
    }

    @ApiOkResponse({
        description: 'Returns game image.',
    })
    @Get('/public/images/:id')
    async getGameImage(@Res() res: Response, @Param('id') gameImageId: string) {
        const gameImage = await this.gameService.getGameImageById(gameImageId);

        throwErrorOrContinue(gameImage);

        const path = join(environment.upload.gamesPath, gameImage.imagePath);

        if (!(await checkFileExists(path))) {
            throw new NotFoundException('Game image not found');
        }

        return fs.createReadStream(path).pipe(res);
    }

    @ApiOkResponse({
        description: 'Delete an image from a game. Returns a success message.',
    })
    @UseGuards(EnsureAuthGuard)
    @Delete('/images/:gameImageId')
    async deleteGameImage(
        @Req() req: Request,
        @Param('gameImageId') gameImageId: string,
    ): Promise<{ message: string }> {
        if (
            !(await this.gameService.verifyUserOwnGameImage(
                req.user.id,
                gameImageId,
            ))
        ) {
            throw new UnauthorizedException(
                "You don't have access to this game",
            );
        }

        const gameImage = await this.gameService.getGameImageById(gameImageId);

        throwErrorOrContinue(gameImage);

        await deleteFile(
            join(environment.upload.gamesPath, gameImage.imagePath),
        );

        throwErrorOrContinue(
            await this.gameService.deleteGameImage(gameImageId),
        );

        return {
            message: 'Game image was deleted sucessfully',
        };
    }

    @ApiCreatedResponse({
        description: 'Add an image to a game. Returns a success message.',
    })
    @UseGuards(EnsureAuthGuard)
    @Post('/:id/images')
    @UseInterceptors(FileInterceptor('file'))
    @UsePipes(new ValidationPipe())
    @ApiConsumes('multipart/form-data')
    async createGameImage(
        @Req() req: Request,
        @Param('id') gameId: string,
        @Query('cover') cover: boolean,
        @Body() { file: _ }: CreateGameImageDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /.(jpg|jpeg|png)/,
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
    ): Promise<{ message: string; gameImage: GameImage }> {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const { path, filename } = file;
        const gameImage = new GameImage({
            gameId,
            cover,
            imagePath: filename,
        });

        if (!(await this.gameService.verifyUserOwnGame(req.user.id, gameId))) {
            throw new UnauthorizedException(
                "You don't have access to this game",
            );
        }

        const result = await this.gameService.saveGameImage(gameImage);

        if (isError(result)) {
            await deleteFile(path);
            throw result;
        }

        return {
            message: `The game image was saved successfully.`,
            gameImage: this.gameImageMapper.toHTTP(gameImage),
        };
    }

    @ApiOkResponse({
        description: 'Delete a game. Returns a success message.',
    })
    @UseGuards(EnsureAuthGuard)
    @Delete('/delete/:id')
    async deleteGame(
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
        await deleteFile(join(environment.public.gamesPath, game.gamePath));
        await this.gameService.deleteGame(game.id);

        return {
            message: 'Game deleted sucessfully',
        };
    }

    @ApiOkResponse({
        description: 'Get current user games',
    })
    @UseGuards(EnsureAuthGuard)
    @Get('/my')
    async getMyGames(@Req() req: Request): Promise<{ games: Game[] }> {
        const games = await this.gameService.findGamesByUserId(req.user.id);

        return {
            games: games.map(this.gameMapper.toHTTP),
        };
    }

    @ApiOkResponse({
        description:
            'Search for games. Returns a list of games, all games count and returned games count.',
    })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'start', required: false, type: Number })
    @ApiQuery({ name: 'title', required: false, type: String })
    @ApiQuery({ name: 'genre', required: false, type: String })
    @ApiQuery({ name: 'description', required: false, type: String })
    @ApiQuery({
        name: 'sort',
        required: false,
        type: String,
    })
    @Get('/public')
    async search(
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('start', new DefaultValuePipe(0), ParseIntPipe) start: number,
        @Query('title') title?: string,
        @Query('genre') genre?: string,
        @Query('description') description?: string,
        @Query('sort', new DefaultValuePipe('id')) sort?: string,
    ): Promise<{ games: Game[]; count: number; total: number }> {
        const sortOptions = [
            'genre',
            'description',
            'title',
            'created_at',
            'updated_at',
        ];
        const options = {
            limit: isNaN(limit) ? 10 : limit,
            start: start || 0,
            sort: (sort && sortOptions.includes(sort) ? sort : null) || 'id',
        };

        const [games, total] = await this.gameService.findWithFilter(options);

        const compare = (str1: string, str2: string): boolean => {
            const s1 = str1.toLowerCase().trim();
            const s2 = str2.toLowerCase().trim();

            if (s1.replaceAll(/\s/g, '') === s2.replaceAll(/\s/g, ''))
                return true;

            const filterFn = (token: string) => s2.search(token) > -1;

            return s1.split(/\s+/).filter(filterFn).length > 0;
        };

        const filteredGames = games.filter(
            (game) =>
                (!genre || compare(genre, game.genre)) &&
                (!title || compare(title, game.title)) &&
                (!description || compare(description, game.description)),
        );

        return {
            total,
            count: filteredGames.length,
            games: filteredGames.map(this.gameMapper.toHTTP),
        };
    }
}
