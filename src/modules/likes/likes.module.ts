import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PostsLike } from 'src/database/models/PostsLike.entity';

@Module({
  imports: [SequelizeModule.forFeature([PostsLike])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
