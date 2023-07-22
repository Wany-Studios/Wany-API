import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { TokenService } from '../../../services/token.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [EmailConfirmationService, TokenService],
    exports: [EmailConfirmationService, TokenService],
})
export class EmailConfirmationModule {}
