import { Controller, Post, Body, Req, Res, Param } from '@nestjs/common';
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
}
