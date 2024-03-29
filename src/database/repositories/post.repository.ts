import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '../models/Post.entity';
import { Includeable, Transaction } from 'sequelize/types';
import { PostsLike } from '../models/PostsLike.entity';
import sequelize from 'sequelize';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post) private readonly postModel: typeof Post,
    @InjectModel(PostsLike) private readonly postLikeModel: typeof PostsLike,
  ) {}

  async create(post: Post): Promise<Post> {
    const newPost = await this.postModel.create({
      ...post.dataValues,
    });

    return newPost;
  }

  async findOneById(id: number, include: string[] = []): Promise<Post> {
    const includeOptions: Includeable[] = include.map((assoc) => ({
      model: this.postModel.associations[assoc].target,
    }));
    return this.postModel.findByPk(id, {
      include: includeOptions,
    });
  }

  async findPostsWithIsLiked(
    userId: number,
    targetUserId: number,
    pageNumber: number = 1,
  ) {
    const posts = await this.postModel.findAll({
      attributes: [
        'id',
        'description',
        'likesCounter',
        'commentsCounter',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(
            'CASE WHEN "postLikes"."userId" IS NOT NULL THEN true ELSE false END',
          ),
          'isLiked',
        ],
      ],
      where: {
        userId: targetUserId,
      },
      include: [
        {
          model: this.postLikeModel,
          attributes: ['userId'],
          where: {
            userId: userId,
          },
          required: false,
        },
      ],
      offset: (pageNumber - 1) * 10,
      limit: 10,
    });

    return posts;
  }

  async updatePost(
    post: Post,
    transaction: Transaction = null,
  ): Promise<Boolean> {
    const newPost = await this.postModel.update(
      {
        ...post.dataValues,
      },
      {
        where: {
          id: post.id,
        },
        transaction,
      },
    );

    return newPost[0] > 0;
  }

  async getPosts(
    pageNumber: number = 1,
    conditions: object = {},
    include: string[] = [],
  ): Promise<Post[]> {
    const includeOptions: Includeable[] = include.map((assoc) => ({
      model: this.postModel.associations[assoc].target,
    }));

    return await this.postModel.findAll({
      where: {
        ...conditions,
      },
      include: includeOptions,
      offset: (pageNumber - 1) * 10,
      limit: 10,
    });
  }

  async getFollowedUsersPosts(
    followedUserIds: number[],
    pageNumber = 1,
    include: string[] = [],
  ): Promise<Post[]> {
    const includeOptions: Includeable[] = include.map((assoc) => ({
      model: this.postModel.associations[assoc].target,
    }));
    return await this.postModel.findAll({
      where: {
        userId: followedUserIds,
      },
      include: includeOptions,
      offset: (pageNumber - 1) * 10,
      limit: 10,
      order: [['createdAt', 'DESC']],
    });
  }
}
