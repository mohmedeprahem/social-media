import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '../models/Post.entity';
import { Includeable } from 'sequelize/types';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post) private readonly postModel: typeof Post) {}

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
}
