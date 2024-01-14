import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './database/models/User.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { Utils } from './utils/utils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      ...Utils.getDatabaseKeys(process.env.NODE_ENV),
      models: [User],
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
