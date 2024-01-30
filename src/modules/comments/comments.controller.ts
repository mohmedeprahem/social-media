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
  Delete,
} from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/CreateComment.dto';
import {
  ApiBody,
  ApiSecurity,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('api/v1/posts/:postId/comments')
export class CommentsController {
  constructor(private readonly _commentsService: CommentsService) {}

  @Post()
  @ApiSecurity('access-token')
  @ApiBody({
    type: CreateCommentDto,
    description: 'Create comment',
  })
  @ApiParam({ name: 'postId', type: Number })
  async createComment(
    @Body() body: CreateCommentDto,
    @Param('postId') postId,
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
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
  @ApiSecurity('access-token')
  @ApiParam({ name: 'postId', type: Number })
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

  @Delete(':commentId')
  @ApiSecurity('access-token')
  @ApiParam({ name: 'postId', type: Number })
  @ApiParam({ name: 'commentId', type: Number })
  async deleteComment(
    @Param('commentId') commentId,
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
  ) {
    await this._commentsService.deleteComment(req.user.sub, commentId);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Comment deleted successfully',
    });
  }
}
