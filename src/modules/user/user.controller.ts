import { UserService } from './user.service';
import {
    checkFileExists,
    deleteFile,
    handleIsInternalServerError,
    isError,
} from '../../utils';
import { EnsureIsAuthenticatedGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { getBaseUrl } from '../../helpers/get-base-url.helper';
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

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(EnsureIsAuthenticatedGuard)
    @Get('/me')
    async getMe(@Req() req: Request) {
        const user = await this.userService.findUserById(req.user.id!);

        if (isError(user)) {
            handleIsInternalServerError(user);
            throw user;
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
            birth_date: user.birth_date,
            updated_at: user.updated_at,
            created_at: user.created_at,
            avatar_url:
                getBaseUrl(req) + `/user/public/${user.username}/avatar`,
        };
    }

    @UseGuards(EnsureIsAuthenticatedGuard)
    @Post('/upload-avatar')
    @UseInterceptors(FileInterceptor('file'))
    async changeAvatar(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const { user } = req;
        const { filename } = file;

        const userAvatar = await this.userService.getUserAvatarByUsername(
            user.username!,
        );

        deleteFile(environment.upload.avatarPath + userAvatar);
        await this.userService.update(user.id, { avatar: filename });

        return { message: 'Avatar image has been sucessfully saved', filename };
    }

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
            avatar_url:
                getBaseUrl(req) + `/user/public/${user.username}/avatar`,
            role: user.role,
        };
    }
}
