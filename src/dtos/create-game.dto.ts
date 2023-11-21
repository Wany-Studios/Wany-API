import { ApiProperty } from '@nestjs/swagger';
import { Genre } from '../modules/models/genre';
import { IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { RemoveExtraSpaces } from '../helpers/class-validator/remove-extra-spaces.decorator';
import { Transform } from 'class-transformer';

export abstract class CreateGameDto {
    @ApiProperty({
        description: 'Genre of the game',
        enum: Genre,
    })
    @IsEnum(Genre)
    @RemoveExtraSpaces()
    genre: Genre;

    @ApiProperty({
        description: 'Name of the game',
        minLength: 2,
    })
    @IsString()
    @Matches(/^[A-Za-z0-9_\-\s\p{Emoji}]+$/, {
        message: 'Invalid characters in the title',
    })
    @RemoveExtraSpaces()
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'Description about the game',
        minLength: 5,
    })
    @IsString()
    @RemoveExtraSpaces()
    @MinLength(1)
    @Transform(({ value }) => value && value.toLowerCase())
    description: string;

    @ApiProperty({
        description: 'The game file',
        type: 'file',
    })
    file: string;
}
