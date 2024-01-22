import { Controller, Get, Post, Body, UseFilters, Res } from '@nestjs/common';
import { UserService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateUserExceptionFilter } from 'src/shared/filters/create-user-exception.filter';
import { CookieService, HeaderService } from 'src/utils';
import { LoginDto, VerifyUserDto, CreateUserDto } from './dto';

@ApiTags('User')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly _userService: UserService) {}

  @Post('/register')
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  @UseFilters(CreateUserExceptionFilter)
  async register(@Body() body: CreateUserDto) {
    const user = await this._userService.createUser(body);

    if (user.success) {
      return {
        success: true,
        status: 200,
        message: 'User created successfully',
        isOTPSent: user.isOTPSent,
      };
    }
  }

  @Post('/verify')
  @ApiBody({
    type: VerifyUserDto,
    description: 'Json structure for user object',
  })
  async verifyAccount(@Body() body: VerifyUserDto, @Res() res) {
    const jwtTokens = await this._userService.verifyAccount(body);

    CookieService.setRefreshTokenCookie(res, jwtTokens.refreshToken);

    HeaderService.setJwtHeader(res, jwtTokens.accessToken);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User verified successfully',
    });
  }

  @Post('/login')
  @ApiBody({
    type: LoginDto,
  })
  async login(@Body() body: LoginDto, @Res() res) {
    const jwtTokens = await this._userService.login(body);

    CookieService.setRefreshTokenCookie(res, jwtTokens.refreshToken);

    HeaderService.setJwtHeader(res, jwtTokens.accessToken);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User logged in successfully',
    });
  }
}
