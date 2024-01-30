import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../models/Comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment) private readonly CommentModel: typeof Comment,
  ) {}

  async createComment(comment: Comment) {
    await this.CommentModel.create({
      ...comment.dataValues,
    });
  }
}
