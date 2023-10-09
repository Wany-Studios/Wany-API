import { UserService } from './user.service';
import {
    checkFileExists,
    deleteFile,
    handleIsInternalServerError,
    isError,
} from '../../utils';
import { EnsureAuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import environment from '../../environment';
import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity, UserSituation } from '../../entities/user.entity';
import { getRoutes } from '../../helpers/get-routes.helper';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOkResponse({
        description: 'Returns the authenticated user data.',
    })
    @UseGuards(EnsureAuthGuard)
    @Get('/me')
    async getMe(
        @Req() req: Request,
    ): Promise<
        Partial<UserEntity> & {
            avatar_url: string;
            account_is_verified: boolean;
        }
    > {
        const user = await this.userService.findUserById(req.user.id!);

        if (isError(user)) {
            handleIsInternalServerError(user);
            throw user;
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            birth_date: user.birth_date,
            updated_at: user.updated_at,
            created_at: user.created_at,
            account_is_verified:
                (user.situation! & UserSituation.NotVerified) === 0,
            avatar_url: getRoutes().avatar_url.replace(
                '{username}',
                user.username!,
            ),
        };
    }

    @ApiOkResponse({
        description: 'Change logged user avatar. Returns a success message.',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'image',
                    format: 'binary',
                },
            },
        },
    })
    @UseGuards(EnsureAuthGuard)
    @Post('/upload-avatar')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async changeAvatar(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ message: string }> {
        const { user } = req;
        const { filename } = file;

        const userAvatar = await this.userService.getUserAvatarByUsername(
            user.username!,
        );

        await deleteFile(environment.upload.avatarPath + userAvatar);
        await this.userService.update(user.id, { avatar: filename });

        return { message: 'Avatar image has been sucessfully saved' };
    }

    @ApiOkResponse({
        description: 'Returns the user avatar image.',
    })
    @Get('/public/:username/avatar')
    async getAvatar(@Res() res: Response, @Param('username') username: string) {
        const userAvatar = await this.userService.getUserAvatarByUsername(
            username,
        );

        if (isError(userAvatar)) throw userAvatar;
        if (!userAvatar) throw new Error("User don't have avatar");

        const path = environment.upload.avatarPath + userAvatar;

        if (!(await checkFileExists(path))) {
            throw new NotFoundException('Avatar not found');
        }

        res.sendFile(path);
    }

    @ApiOkResponse({
        description: 'Returns user data with username.',
    })
    @Get('/public/:username')
    async byUsername(@Req() req: Request, @Param('username') username: string) {
        if (!username || !username.trim()) {
            throw new BadRequestException('Username cannot be empty');
        }

        const user = await this.userService.findUserByUsername(username);

        if (isError(user)) {
            handleIsInternalServerError(user);
            throw user;
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: getRoutes().avatar_url.replace(
                '{username}',
                user.username!,
            ),
            role: user.role,
        };
    }
}
