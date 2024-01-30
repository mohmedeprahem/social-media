import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserRepository,
  CommentRepository,
  PostRepository,
} from 'src/database/repositories';
import { CreateCommentDto } from './dto';
import { plainToClass } from 'class-transformer';
import { Comment } from 'src/database/models/Comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _commentRepository: CommentRepository,
    private readonly _postRepository: PostRepository,
  ) {}

  async createComment(
    userUuid: string,
    postId: number,
    body: CreateCommentDto,
  ) {
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

    const comment = plainToClass(Comment, body);

    comment.userId = user.id;
    comment.postId = post.id;

    await this._commentRepository.createComment(comment);
  }
}
