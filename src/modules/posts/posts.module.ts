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
} from '../../database/repositories';
import { LikesService } from '../likes/likes.service';
import { PostsLike } from 'src/database/models/PostsLike.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Post, PostsLike])],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostRepository,
    UserRepository,
    LikesService,
    LikeRepository,
  ],
})
export class PostsModule {}
