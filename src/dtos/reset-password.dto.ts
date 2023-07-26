import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../helpers/class-validator/match.decorator';
import { Transform } from 'class-transformer';

export abstract class ResetPasswordDto {
    @IsEmail({}, { message: 'This is not a valid email' })
    @Transform(({ value }) => value && value.toLowerCase())
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    newPassword: string;

    @IsString()
    @MinLength(8, {
        message: 'Repeat password must be at least 8 characters long',
    })
    @Match('newPassword', { message: "Passwords don't match" })
    repeatNewPassword: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
