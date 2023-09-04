import { DataSource } from 'typeorm';
import dataSourceOptions from './database.config';

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
