import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User.entity';
import * as dotenv from 'dotenv';

dotenv.config();


export const databaseProviders = [{
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dialect: 'postgres',
    });
    sequelize.addModels([User]);
    return sequelize;
  },
}];
