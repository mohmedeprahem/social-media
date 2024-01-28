import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody } from '@nestjs/swagger';
import { CreatePostDto } from './dto/createPost.dto';
import { PostsService } from './posts.service';

@Controller('api/v1/posts')
export class PostsController {
  constructor(private _postsService: PostsService) {}

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
}
