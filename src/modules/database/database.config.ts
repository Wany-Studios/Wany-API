import { DataSourceOptions } from 'typeorm';
import environment from '../../environment';

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

export default config;
