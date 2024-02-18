import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/User.entity';
import { Post } from 'src/database/models/Post.entity';
import {
  PostRepository,
  UserRepository,
  LikeRepository,
  UserFollowingRepository,
} from '../../database/repositories';
import { LikesService } from '../likes/likes.service';
import { PostsLike } from 'src/database/models/PostsLike.entity';
import { UsersFollowing } from 'src/database/models/UsersFollowing.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Post, PostsLike, UsersFollowing]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostRepository,
    UserRepository,
    LikesService,
    LikeRepository,
    UserFollowingRepository,
  ],
})
export class PostsModule {}
