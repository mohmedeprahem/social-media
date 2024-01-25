import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowUserDto } from './dto';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody } from '@nestjs/swagger';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

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
}
