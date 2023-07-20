import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import environment from '../environment';
import { User } from '../user/user.entity';
import { DataSourceOptions } from 'typeorm';
import { EmailConfirmation } from '../email/confirmation/email-confirmation.entity';

const config: DataSourceOptions = {
  type: environment.database.type as any,
  host: environment.database.host,
  port: environment.database.port,
  username: environment.database.username,
  password: environment.database.password,
  database: environment.database.name,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: environment.isDevelopment,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([EmailConfirmation]),
  ],
  exports: [TypeOrmModule],
  providers: [],
})
export class DatabaseModule { }
