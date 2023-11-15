import { Transform } from 'class-transformer';
import {
    IsDate,
    IsOptional,
    IsString,
    Matches,
    MaxDate,
    MinLength,
} from 'class-validator';
import { RemoveExtraSpaces } from '../helpers/class-validator/remove-extra-spaces.decorator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class UpdateUserDto {
    @ApiProperty({
        description: 'User bio.',
    })
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiProperty({
        description: 'Username choosen by the user',
        minLength: 3,
    })
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
    @IsOptional()
    username?: string;

    @ApiProperty({
        description: 'User password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsOptional()
    password?: string;

    @ApiProperty()
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate()
    @MaxDate(new Date())
    @IsOptional()
    dateOfBirth?: Date;
}
