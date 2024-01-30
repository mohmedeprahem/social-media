import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostsLike } from '../models/PostsLike.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectModel(PostsLike) private readonly PostsLikeModel: typeof PostsLike,
  ) {}

  async IsUserLikedPost(userId: number, postId: number): Promise<boolean> {
    const like = await this.PostsLikeModel.findOne({
      where: {
        userId,
        postId,
      },
    });

    if (!like) {
      return false;
    }
    return true;
  }

  async likePost(userId: number, postId: number): Promise<boolean> {
    const like = await this.PostsLikeModel.findOne({
      where: {
        userId,
        postId,
      },
    });

    if (!like) {
      await this.PostsLikeModel.create({
        userId,
        postId,
      });
    } else {
      await like.destroy();
    }
    return true;
  }
}
