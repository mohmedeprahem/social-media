import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/User.entity';
import { Comment } from 'src/database/models/Comment.entity';
import { Post } from 'src/database/models/Post.entity';
import { PostsLike } from 'src/database/models/PostsLike.entity';
import {
  UserRepository,
  CommentRepository,
  PostRepository,
} from 'src/database/repositories';

@Module({
  imports: [SequelizeModule.forFeature([User, Comment, Post, PostsLike])],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    UserRepository,
    CommentRepository,
    PostRepository,
  ],
})
export class CommentsModule {}
