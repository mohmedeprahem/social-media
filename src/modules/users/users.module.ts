import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersFollowing } from 'src/database/models/UsersFollowing.entity';
import { User } from 'src/database/models/User.entity';
import {
  PostRepository,
  UserFollowingRepository,
  UserRepository,
} from 'src/database/repositories';
import { PostsLike } from 'src/database/models/PostsLike.entity';
import { PostsService } from '../posts/posts.service';
import { Post } from 'src/database/models/Post.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UsersFollowing, PostsLike, Post]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserFollowingRepository,
    UserRepository,
    PostRepository,
    PostsService,
  ],
  exports: [SequelizeModule],
})
export class UsersModule {}
