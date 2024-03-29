import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../models/Comment.entity';
import { Includeable, Transaction } from 'sequelize';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment) private readonly CommentModel: typeof Comment,
  ) {}

  async createComment(
    comment: Comment,
    transaction: Transaction = null,
  ): Promise<Comment> {
    return await this.CommentModel.create(
      {
        ...comment.dataValues,
      },
      {
        transaction,
      },
    );
  }

  async getCommentsForPost(
    postId: number,
    include: string[] = [],
    pageNumber = 1,
  ) {
    const includeOptions: Includeable[] = include.map((assoc) => ({
      model: this.CommentModel.associations[assoc].target,
    }));

    return await this.CommentModel.findAll({
      where: {
        postId,
      },
      include: includeOptions,
      offset: (pageNumber - 1) * 10,
    });
  }

  async findOneById(id: number, include: string[] = []) {
    const includeOptions: Includeable[] = include.map((assoc) => ({
      model: this.CommentModel.associations[assoc].target,
    }));

    return await this.CommentModel.findByPk(id, {
      include: includeOptions,
    });
  }

  async deleteComment(id: number, transaction: Transaction = null) {
    await this.CommentModel.destroy({
      where: {
        id,
      },
      transaction,
    });
  }
}
