import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailConfirmationTokenService {
    generateToken(): string {
        const characters = 'VLIDK435SHN08ERJUAFXBOWPQ16CG7ZM29TY';
        let token = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
        }

        return token;
    }
}
