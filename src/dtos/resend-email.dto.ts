import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export abstract class ResendEmailDto {
    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'This is not a valid email' })
    @Transform(({ value }) => value && value.toLowerCase())
    email: string;
}
