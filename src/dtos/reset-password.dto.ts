import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../helpers/class-validator/match.decorator';
import { Transform } from 'class-transformer';

export abstract class ResetPasswordDto {
    @IsEmail({}, { message: 'This is not a valid email' })
    @Transform(({ value }) => value && value.toLowerCase())
    email: string;

    @IsString()
    newPassword: string;

    @IsString()
    @Match('newPassword', { message: "Passwords don't match" })
    repeatNewPassword: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
