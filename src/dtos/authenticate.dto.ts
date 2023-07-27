import { Transform } from 'class-transformer';
import { IsString, Matches, MinLength } from 'class-validator';
import { RemoveExtraSpaces } from '../helpers/class-validator/remove-extra-spaces.decorator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AuthenticateDto {
    @ApiProperty({
        description: 'User username or email',
        minLength: 3,
    })
    @IsString()
    @Matches(/^[A-Za-z0-9_\-\s\p{Emoji}]+$/, {
        message: 'Invalid characters in the username/email field',
    })
    @MinLength(3)
    @RemoveExtraSpaces()
    @Transform(({ value }) => value && value.toLowerCase())
    usernameOrEmail: string;

    @ApiProperty({
        description: 'User password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
