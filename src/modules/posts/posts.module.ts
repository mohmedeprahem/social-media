import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/database/models/User.entity';
import { Post } from 'src/database/models/Post.entity';
import { PostRepository, UserRepository } from '../../database/repositories';

@Module({
  imports: [SequelizeModule.forFeature([User, Post])],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, UserRepository],
})
export class PostsModule {}
