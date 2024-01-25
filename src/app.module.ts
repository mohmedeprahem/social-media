import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './database/models/User.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { KeysService } from './utils/keysService.util';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { UsersFollowing } from './database/models/UsersFollowing.entity';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      ...KeysService.getDatabaseKeys(process.env.NODE_ENV),
      models: [User, UsersFollowing],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
