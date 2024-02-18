import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  PostRepository,
  UserRepository,
  UserFollowingRepository,
} from '../../database/repositories';
import { Post } from 'src/database/models/Post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly _postsRepository: PostRepository,
    private readonly _userRepository: UserRepository,
    private readonly _userFollowingRepository: UserFollowingRepository,
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
    targetUserUuid: string,
    pageNumber: number = 1,
    userUuid: string = null,
  ) {
    const targetUser = await this._userRepository.findUser({
      uuid: targetUserUuid,
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.isEmailPrivate && !userUuid) {
      throw new UnauthorizedException();
    }

    if (!userUuid) {
      const posts = await this._postsRepository.getPosts(pageNumber, {
        userId: targetUser.id,
      });

      return posts;
    }

    // Check if the user is following the target user
    const loggedInUser = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!loggedInUser) {
      throw new Error();
    }

    if (loggedInUser.id !== targetUser.id) {
      const userFollowing =
        await this._userFollowingRepository.findOneUsersFollowing({
          userId: loggedInUser.id,
          followingUserId: targetUser.id,
        });

      if (!userFollowing) {
        throw new UnauthorizedException();
      }
    }

    const posts = await this._postsRepository.findPostsWithIsLiked(
      loggedInUser.id,
      targetUser.id,
      pageNumber,
    );

    return posts;
  }

  async getFollowedUsersPosts(userUuid: string, pageNumber: number = 1) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    const followedUsers = await this._userFollowingRepository.getFollowedUsers(
      user.id,
    );

    if (!followedUsers || followedUsers.length === 0) {
      return [];
    }

    const posts = await this._postsRepository.getFollowedUsersPosts(
      followedUsers.map((user) => user.followingUserId),
      pageNumber,
      ['user'],
    );

    return posts;
  }
}
