import { DataSource } from 'typeorm';
import dataSourceOptions from './database.config';

console.log(process.env);
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
