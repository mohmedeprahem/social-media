import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersFollowing } from 'src/database/models/UsersFollowing.entity';
import { User } from 'src/database/models/User.entity';
import {
  UserFollowingRepository,
  UserRepository,
} from 'src/database/repositories';

@Module({
  imports: [SequelizeModule.forFeature([User, UsersFollowing])],
  controllers: [UsersController],
  providers: [UsersService, UserFollowingRepository, UserRepository],
  exports: [SequelizeModule],
})
export class UsersModule {}
