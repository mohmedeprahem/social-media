import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody } from '@nestjs/swagger';
import { CreatePostDto } from './dto/createPost.dto';
import { PostsService } from './posts.service';
import { LikesService } from '../likes/likes.service';

@Controller('api/v1/posts')
export class PostsController {
  constructor(
    private _postsService: PostsService,
    private _likesService: LikesService,
  ) {}

  @Post()
  @ApiBody({
    type: CreatePostDto,
  })
  async createPost(
    @Body() body: CreatePostDto,
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
  ) {
    const newPost = await this._postsService.createPost(
      req.user.sub,
      body.description,
    );

    return res.status(201).json({
      success: true,
      status: 201,
      message: 'Post created successfully',
      postID: newPost.id,
    });
  }

  @Get(':id')
  async getOnePost(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('id') id: number,
  ) {
    const post = await this._postsService.getOnePost(req.user.sub, id);

    const isLiked = await this._likesService.userLikesPost(
      req.user.sub,
      post.id,
    );

    const postResponse = {
      id: post.id,
      description: post.description,
      numberOfLikes: post.likesCounter,
      numberOfComments: post.commentsCounter,
      isLiked: isLiked,
      createdAt: post.createdAt,
      user: {
        fullName: post.user.fullName,
        UUID: post.user.uuid,
      },
    };
    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Post fetched successfully',
      postResponse,
    });
  }

  @Patch(':id/like')
  async likePost(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('id') id: number,
  ) {
    const post = await this._postsService.getOnePost(req.user.sub, id);
    await this._likesService.likePost(req.user.sub, post.id);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Post liked successfully',
    });
  }
}
