import {
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './auth.service';
import { ApiTags, ApiBody, ApiHeader } from '@nestjs/swagger';
import { CreateUserExceptionFilter } from 'src/common/filters/create-user-exception.filter';
import { CookieService, HeaderService } from 'src/utils';
import { LoginDto, VerifyUserDto, CreateUserDto, ResendOtpDto } from './dto';
import { AtGuard, RtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('User')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly _userService: UserService) {}

  @Public()
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

  @Public()
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

  @Public()
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

  @Post('/logout')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
    required: true,
  })
  async logout(@Req() req, @Res() res) {
    res.clearCookie('refreshToken');

    await this._userService.logout(req.user.sub);

    res.status(204).send();
  }

  @Public()
  @Post('/resend-otp')
  @ApiBody({
    type: ResendOtpDto,
  })
  async resendOTP(@Body() body: ResendOtpDto) {
    const user = await this._userService.resendOTP(body.email);

    return {
      success: true,
      status: 200,
      message: 'OTP sent successfully',
    };
  }

  @Public()
  @Post('/refresh-token')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token',
  })
  @UseGuards(RtGuard)
  async refreshToken(@Req() req) {
    const jwtTokens = await this._userService.refreshToken(
      req.user.payload.sub,
      req.user.token,
    );

    CookieService.setRefreshTokenCookie(req.res, jwtTokens.refreshToken);

    HeaderService.setJwtHeader(req.res, jwtTokens.accessToken);

    return {
      success: true,
      status: 200,
      message: 'Refresh token generated successfully',
    };
  }
}
