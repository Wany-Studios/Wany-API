import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationTokenService } from '../../../services/email-confirmation-token.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [EmailConfirmationService, EmailConfirmationTokenService],
    exports: [EmailConfirmationService, EmailConfirmationTokenService],
})
export class EmailConfirmationModule {}
