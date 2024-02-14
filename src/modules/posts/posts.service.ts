import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository, UserRepository } from '../../database/repositories';
import { Post } from 'src/database/models/Post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly _postsRepository: PostRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  async createPost(userUuid: string, description: string) {
    console.log(this._postsRepository);
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }
    const newPost = new Post();
    newPost.description = description;
    newPost.userId = user.id;

    return this._postsRepository.create(newPost);
  }

  async getOnePost(userUuid: string, postId: number) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    const post = await this._postsRepository.findOneById(postId, ['user']);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async getUserPosts(
    userUuid: string,
    targetUserId: string,
    pageNumber: number = 1,
  ) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    const targetUser = await this._userRepository.findUser({
      uuid: targetUserId,
    });

    const posts = await this._postsRepository.findPostsWithIsLiked(
      user.id,
      targetUser.id,
      pageNumber,
    );

    return posts;
  }
}
