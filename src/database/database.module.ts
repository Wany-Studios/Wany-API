import { UserRepository } from '../user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import environment from '../environment';
import { User } from '../user/user.entity';
import { DataSourceOptions } from 'typeorm';

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
  imports: [TypeOrmModule.forRoot(config), TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [],
})
export class DatabaseModule { }
