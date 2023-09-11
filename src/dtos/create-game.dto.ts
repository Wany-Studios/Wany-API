import { ApiProperty } from '@nestjs/swagger';
import { Genre } from '../modules/models/genre';
import { IsEnum, IsString } from 'class-validator';
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
    @RemoveExtraSpaces()
    title: string;

    @ApiProperty({
        description: 'Description about the game',
        minLength: 5,
    })
    @IsString()
    @RemoveExtraSpaces()
    @Transform(({ value }) => value && value.toLowerCase())
    description: string;

    @ApiProperty({
        description: 'The game file',
        type: 'file',
    })
    file: string;
}
