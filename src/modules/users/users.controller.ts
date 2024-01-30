import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowUserDto } from './dto';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PostsService } from '../posts/posts.service';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _postsService: PostsService,
  ) {}

  @Post('follow')
  @ApiSecurity('access-token')
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
  @ApiSecurity('access-token')
  async getUserPosts(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('id') id: number,
    @Query('pageNumber') pageNumber = 1,
  ) {
    const posts = await this._postsService.getUserPosts(
      req.user.sub,
      id,
      pageNumber,
    );

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
      ...successResponse,
    });
  }
}
