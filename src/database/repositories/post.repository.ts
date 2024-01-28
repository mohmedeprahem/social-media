import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from '../models/Post.entity';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post) private readonly postModel: typeof Post) {}

  async create(post: Post): Promise<Post> {
    const newPost = await this.postModel.create({
      ...post.dataValues,
    });

    return newPost;
  }
}
