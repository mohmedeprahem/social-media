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
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { CreateUserExceptionFilter } from 'src/common/filters/create-user-exception.filter';
import { CookieService, HeaderService } from 'src/utils';
import { LoginDto, VerifyUserDto, CreateUserDto, ResendOtpDto } from './dto';
import { AtGuard, RtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Public()
  @Post('/register')
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  @UseFilters(CreateUserExceptionFilter)
  async register(@Body() body: CreateUserDto) {
    const user = await this._authService.createUser(body);

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
    const jwtTokens = await this._authService.verifyAccount(body);

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
    const jwtTokens = await this._authService.login(body);

    CookieService.setRefreshTokenCookie(res, jwtTokens.refreshToken);

    HeaderService.setJwtHeader(res, jwtTokens.accessToken);

    res.status(200).json({
      success: true,
      status: 200,
      message: 'User logged in successfully',
    });
  }

  @Post('/logout')
  @ApiSecurity('access-token')
  async logout(@Req() req, @Res() res) {
    res.clearCookie('refreshToken');

    await this._authService.logout(req.user.sub);

    res.status(204).send();
  }

  @Public()
  @Post('/resend-otp')
  @ApiBody({
    type: ResendOtpDto,
  })
  async resendOTP(@Body() body: ResendOtpDto) {
    const user = await this._authService.resendOTP(body.email);

    return {
      success: true,
      status: 200,
      message: 'OTP sent successfully',
    };
  }

  @Public()
  @Post('/refresh-token')
  @UseGuards(RtGuard)
  async refreshToken(@Req() req) {
    const jwtTokens = await this._authService.refreshToken(
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
