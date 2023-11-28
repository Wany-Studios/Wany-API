import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
    generateToken(): string {
        const characters = 'VLIDK435SHN08ERJUAFXBOWPQ16CG7ZM29TY';
        let token = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
        }

        return token;
    }

    generatePassword() {
        const characters =
            '8yhNjiwTD45LORU2eXYcaSvHmd6EKJp0nB3txVQqr7PMsobGIuC9zAZf1lgFWk';
        let password = '';

        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }

        return password;
    }

    generateResetPasswordToken() {
        const characters =
            '8yhNjiwTD45LORU2eXYcaSvHmd6EKJp0nB3txVQqr7PMsobGIuC9zAZf1lgFWk';
        let token = '';

        for (let i = 0; i < 64; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
        }

        return token;
    }
}
