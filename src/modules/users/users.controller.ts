import { Controller, Post, Body, Req, Res, Patch, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowUserDto, ToggleEmailPrivacyRequestDto } from './dto';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @Post('follows')
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

  @Patch('email-privacy')
  @ApiSecurity('access-token')
  @ApiBody({
    type: ToggleEmailPrivacyRequestDto,
    description: 'Json structure for user object',
  })
  async toggleEmailPrivacy(
    @Body() body: ToggleEmailPrivacyRequestDto,
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
  ) {
    const user = await this._usersService.toggleEmailPrivacy(
      req.user.sub,
      body.isEmailPrivate,
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'success',
      isEmailPrivate: user.isEmailPrivate,
    });
  }

  @Get('info')
  @ApiSecurity('access-token')
  async getUserInfo(@Req() req: IGetUserAuthInfoRequest, @Res() res) {
    const user = await this._usersService.getUserInfo(req.user.sub);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'success',
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
      },
    });
  }
}
