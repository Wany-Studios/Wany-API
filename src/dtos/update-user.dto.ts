import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDate, IsString, Matches, MaxDate, MinLength } from 'class-validator';
import { RemoveExtraSpaces } from '../helpers/class-validator/remove-extra-spaces.decorator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class UpdateUserDto {
    @ApiProperty({
        description: 'Username bio.',
    })
    @Optional()
    @IsString()
    bio?: string;

    @ApiProperty({
        description: 'Username choosen by the user',
        minLength: 3,
    })
    @Optional()
    @IsString()
    @Matches(/^[A-Za-z0-9_\-\s\p{Emoji}]+$/, {
        message: 'Invalid characters in the username',
    })
    @MinLength(3)
    @RemoveExtraSpaces()
    @Transform(({ value }) => value && value.toLowerCase())
    @Matches(/^[a-z0-9_\-\s\p{Emoji}]+$/, {
        message: 'Invalid characters in the username/email field',
    })
    username?: string;

    @Optional()
    @ApiProperty({
        description: 'User password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password?: string;

    @ApiProperty()
    @Optional()
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate()
    @MaxDate(new Date())
    dateOfBirth?: Date;
}
