import {
    Injectable
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    async hashPassword(password: string) {
        const saltOrRounds = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePassword(plainPassword: string, hash: string) {
        return await bcrypt.compare(plainPassword, hash);
    }
}
