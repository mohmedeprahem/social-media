import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Patch,
  Get,
  Query,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FollowUserDto,
  ToggleEmailPrivacyRequestDto,
  UpdateEmailRequestDto,
} from './dto';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody, ApiSecurity, ApiTags, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

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

  @Get('search')
  @Public()
  async searchUsers(
    @Query('filter') filter: string,
    @Req() req: Request,
    @Res() res,
  ) {
    const users = await this._usersService.searchUsers(filter);

    if (!users || users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    const SuccessResponse = {
      success: true,
      status: 200,
      message: 'success',
      users: users.map((user) => ({
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
      })),
    };

    return res.status(200).json({
      ...SuccessResponse,
    });
  }

  @Get('profile/:uuid')
  @Public()
  @ApiParam({ name: 'uuid', type: 'string' })
  @ApiSecurity('access-token')
  async getUserProfile(
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
    @Param('uuid') uuid,
  ) {
    const user = await this._usersService.getUserInfo(uuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const successResponse = {
      success: true,
      status: 200,
      message: 'success',
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        email: user.email,
        isEmailPrivate: user.isEmailPrivate,
        age: user.dateOfBirth
          ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
          : null,
        dataOfBirth: user.dateOfBirth,
        gender: user.gender,
        likesCounter: user.likeCounter,
        commentsCounter: user.commentCounter,
        isPersonalProfile: false,
        isFollowedBy: false,
      },
    };

    if (req.user && req.user.sub) {
      if (user.uuid === req.user.sub) {
        successResponse.user.isPersonalProfile = true;
        successResponse.user.isFollowedBy = true;
      }

      const isFollowing = await this._usersService.isFollowing(
        req.user.sub,
        uuid,
      );

      if (isFollowing) {
        successResponse.user.isFollowedBy = true;
      }
    }

    return res.status(200).json({
      ...successResponse,
    });
  }

  @Patch('email')
  @ApiSecurity('access-token')
  @ApiBody({
    type: UpdateEmailRequestDto,
  })
  async updateEmail(
    @Body() body: UpdateEmailRequestDto,
    @Req() req: IGetUserAuthInfoRequest,
    @Res() res,
  ) {
    const user = await this._usersService.updateEmail(
      req.user.sub,
      body.newEmail,
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'success',
    });
  }

  @Get('following')
  @ApiSecurity('access-token')
  async getFollowingUsers(@Req() req: IGetUserAuthInfoRequest, @Res() res) {
    const following = await this._usersService.getFollowingUsers(req.user.sub);

    if (!following || following.length === 0) {
      throw new NotFoundException('Users not found');
    }

    const successResponse = {
      success: true,
      status: 200,
      message: 'success',
      users: following.map((user) => ({
        uuid: user.followingUser.uuid,
        fullName: user.followingUser.fullName,
        email: user.followingUser.email,
      })),
    };

    return res.status(200).json({
      ...successResponse,
    });
  }
}
