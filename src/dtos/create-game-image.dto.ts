import { ApiProperty } from '@nestjs/swagger';

export abstract class CreateGameImageDto {
    @ApiProperty({
        description: 'The game file',
        type: 'file',
    })
    file: string;
}
