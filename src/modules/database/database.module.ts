import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';
import environment from '../../environment';
import { ResetPassword } from '../../entities/reset-password.entity';

const config: DataSourceOptions = {
    type: environment.database.type as any,
    host: environment.database.host,
    port: environment.database.port,
    username: environment.database.username,
    password: environment.database.password,
    database: environment.database.name,
    entities: environment.server.entities,
    synchronize: environment.isDevelopment,
};

const dataSourceProvider = {
    provide: DataSource,
    useValue: config,
};

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([EmailConfirmation]),
        TypeOrmModule.forFeature([ResetPassword]),
    ],
    exports: [TypeOrmModule],
    providers: [],
})
export class DatabaseModule {}
