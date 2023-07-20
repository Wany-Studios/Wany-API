import { Equals, IsDate, IsDateString, IsEmail, IsString, MinLength, } from "class-validator";

export abstract class CreateUserDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsEmail({}, { message: 'This is not a valid email' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsString()
    @MinLength(8, { message: "Repeat password must be at least 8 characters long" })
    @Equals('password', { message: "Passwords don't match" })
    repeatPassword: string;

    @IsDateString()
    @IsDate()
    dateOfBirth: Date = new Date();
}
