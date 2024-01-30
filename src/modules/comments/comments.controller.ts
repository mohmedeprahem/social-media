import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Param,
  Query,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto';

@Controller('api/v1/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly _commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('postId') postId,
    @Body() body: CreateCommentDto,
  ) {
    const comment = await this._commentsService.createComment(
      req.user.sub,
      postId,
      body,
    );

    return res.status(201).json({
      success: true,
      status: 201,
      message: 'Comment created successfully',
    });
  }

  @Get()
  async getCommentsForPost(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('postId') postId,
    @Query('pageNumber') pageNumber = 1,
  ) {
    const comments = await this._commentsService.getCommentsForPost(
      req.user.sub,
      postId,
      pageNumber,
    );

    if (!comments || comments.length === 0) {
      throw new NotFoundException('Comments not found');
    }

    const SuccessResponse = {
      success: true,
      status: 200,
      message: 'success',
      ...comments.map((comment) => ({
        id: comment.id,
        description: comment.description,
        createdAt: comment.createdAt,
        user: {
          uuid: comment.user.uuid,
          fullName: comment.user.fullName,
        },
      })),
    };

    return res.status(200).json({
      ...SuccessResponse,
    });
  }
}
