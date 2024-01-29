import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowUserDto } from './dto';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody } from '@nestjs/swagger';
import { PostsService } from '../posts/posts.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _postsService: PostsService,
  ) {}

  @Post('follow')
  @ApiBody({
    type: FollowUserDto,
    description: 'Json structure for user object',
  })
  async followUser(
    @Body() body: FollowUserDto,
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
  ) {
    await this._usersService.followUser(req.user.sub, body.targetUserUuid);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'success',
    });
  }

  @Get(':id/posts')
  async getUserPosts(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('id') id: number,
  ) {
    const posts = await this._postsService.getUserPosts(req.user.sub, id);

    if (!posts || posts.length === 0) {
      throw new NotFoundException('not found');
    }

    const successResponse = {
      success: true,
      status: 200,
      message: 'success',
      ...posts.map((post) => ({
        id: post.id,
        description: post.description,
        numberOfLikes: post.likesCounter,
        numberOfComments: post.commentsCounter,
        isLiked: post.isLiked,
        createdAt: post.createdAt,
      })),
    };

    return res.status(200).json({
      successResponse,
    });
  }
}
