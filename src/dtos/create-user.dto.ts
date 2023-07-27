import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsString,
    Matches,
    MaxDate,
    MinLength,
} from 'class-validator';
import { Match } from '../helpers/class-validator/match.decorator';
import { RemoveExtraSpaces } from '../helpers/class-validator/remove-extra-spaces.decorator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class CreateUserDto {
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
    username: string;

    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'This is not a valid email' })
    @Transform(({ value }) => value && value.toLowerCase())
    email: string;

    @ApiProperty({
        description: 'User password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @ApiProperty({
        description:
            'Password confirmation, the user must provide the same password',
        minimum: 8,
    })
    @IsString()
    @MinLength(8, {
        message: 'Repeat password must be at least 8 characters long',
    })
    @Match('password', { message: "Passwords don't match" })
    repeatPassword: string;

    @ApiProperty()
    @Optional()
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate()
    @MaxDate(new Date())
    dateOfBirth: Date;
}
