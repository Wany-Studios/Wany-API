import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export abstract class ForgotPasswordDto {
    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'This is not a valid email' })
    @Transform(({ value }) => value && value.toLowerCase())
    email: string;
}
