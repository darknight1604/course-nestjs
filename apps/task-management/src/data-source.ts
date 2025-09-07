import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CreateSession1757163872579 } from './migrations/1757163872579-CreateSession';
import { CreateTeam1757169841968 } from './migrations/1757169841968-CreateTeam';

dotenv.config({ path: 'apps/task-management/.development.env' });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    /*...*/
  ],
  migrations: [CreateSession1757163872579, CreateTeam1757169841968],
  logging: true,
  synchronize: false,
});
