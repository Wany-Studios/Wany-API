import { DataSource } from 'typeorm';
import config from './database.config';

const dataSourceProvider = {
    provide: DataSource,
    useValue: config,
};

export default dataSourceProvider;
