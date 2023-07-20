import { Optional } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsString, Matches, MaxDate, MinLength, } from "class-validator";
import { Match } from "../helpers/class-validator/match.decorator";
import { RemoveExtraSpaces } from "../helpers/class-validator/remove-extra-spaces.decorator";

export abstract class CreateUserDto {
    @IsString()
    @Matches(/^[A-Za-z0-9_\-\s\p{Emoji}]+$/, { message: "Invalid characters in the username" })
    @MinLength(3)
    @RemoveExtraSpaces()
    username: string;

    @IsEmail({}, { message: 'This is not a valid email' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsString()
    @MinLength(8, { message: "Repeat password must be at least 8 characters long" })
    @Match('password', { message: "Passwords don't match" })
    repeatPassword: string;

    @Optional()
    @Transform(({ value }) => value ? new Date(value) : new Date())
    @IsDate()
    @MaxDate(new Date())
    dateOfBirth: Date;
}
