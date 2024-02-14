import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  UserRepository,
  CommentRepository,
  PostRepository,
} from 'src/database/repositories';
import { CreateCommentDto } from './dto';
import { plainToClass } from 'class-transformer';
import { Comment } from 'src/database/models/Comment.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CommentsService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _commentRepository: CommentRepository,
    private readonly _postRepository: PostRepository,
    private readonly sequelize: Sequelize,
  ) {}

  async createComment(
    userUuid: string,
    postId: number,
    body: CreateCommentDto,
  ): Promise<Comment> {
    const transaction = await this.sequelize.transaction();

    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    const post = await this._postRepository.findOneById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let comment = plainToClass(Comment, body);

    comment.userId = user.id;
    comment.postId = post.id;
    try {
      // create comment
      comment = await this._commentRepository.createComment(
        comment,
        transaction,
      );

      // update post counter for comments
      post.commentsCounter++;

      await this._postRepository.updatePost(post, transaction);

      // update user owner post counter for comments
      const ownerPost = await this._userRepository.findUser({
        id: post.userId,
      });

      if (!ownerPost) {
        throw new Error();
      }
      ownerPost.commentCounter++;

      await this._userRepository.updateUserById(ownerPost, transaction);

      await transaction.commit();

      return comment;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getCommentsForPost(userUuid: string, postId: number, pageNumber = 1) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    const post = await this._postRepository.findOneById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comments = await this._commentRepository.getCommentsForPost(
      postId,
      ['user'],
      pageNumber,
    );

    return comments;
  }

  async deleteComment(userUuid: string, commentId: number) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    const comment = await this._commentRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== user.id) {
      throw new UnauthorizedException('unauthorized');
    }

    await this._commentRepository.deleteComment(commentId);
  }
}
