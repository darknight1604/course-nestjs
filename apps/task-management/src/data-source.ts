import { DataSource } from 'typeorm';
import { CreateSession1757163872579 } from './migrations/1757163872579-CreateSession';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'pg-task-management',
  entities: [
    /*...*/
  ],
  migrations: [CreateSession1757163872579],
  logging: true,
});
