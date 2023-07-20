import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EmailConfirmation, EmailConfirmationRepository } from './email-confirmation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult } from 'typeorm';
import { EmailConfirmationTokenService } from './token/email-confirmation-token.service';

@Injectable()
export class EmailConfirmationService {
    constructor(
        @InjectRepository(EmailConfirmation) private emailConfirmationRepository: EmailConfirmationRepository,
        private readonly emailConfirmationTokenService: EmailConfirmationTokenService
    ) { }

    generateToken() {
        return this.emailConfirmationTokenService.generateToken();
    }

    async findEmailConfirmationWithToken(token: string): Promise<EmailConfirmation | NotFoundException> {
        const emailConfirmation = await this.emailConfirmationRepository.findOneBy({ token });
        return emailConfirmation || new NotFoundException('Email confirmation not found');
    }

    async markEmailConfirmationTokenAsUsed(emailConfirmationId: string): Promise<null | NotFoundException> {
        if (!await this.emailConfirmationRepository.exist({
            where: {
                id: emailConfirmationId
            }
        })) {
            return new NotFoundException('Email confirmation not found');
        }

        await this.emailConfirmationRepository.save({
            id: emailConfirmationId,
            used: true
        });

        return null;
    }

    async createEmailConfirmation(emailConfirmation: EmailConfirmation): Promise<InsertResult | InternalServerErrorException> {
        try {
            return await this.emailConfirmationRepository.insert(emailConfirmation);
        }
        catch (err) {
            return new InternalServerErrorException(err.message);
        }
    }
}


