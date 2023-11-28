import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../helpers/class-validator/match.decorator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class ResetPasswordFormDto {
    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'This is not a valid email' })
    @Transform(({ value }) => value && value.toLowerCase())
    email: string;

    @ApiProperty({
        description: 'New user password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    newPassword: string;

    @ApiProperty({
        description:
            'Password confirmation, the user must provide the same password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, {
        message: 'Repeat password must be at least 8 characters long',
    })
    @Match('newPassword', { message: "Passwords don't match" })
    repeatNewPassword: string;

    @ApiProperty({
        description: 'The token sent to user email',
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}
