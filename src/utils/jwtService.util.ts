import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/auth/types';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JWTService {
  constructor(
    private _jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload) {
    const accessToken = await this._jwtService.signAsync(payload, {
      secret: this.config.get('JWT_AT_SECRET'),
      expiresIn: this.config.get('JWT_AT_EXPIRES_IN'),
    });
    const refreshToken = await this._jwtService.signAsync(payload, {
      secret: this.config.get('JWT_RT_SECRET'),
      expiresIn: this.config.get('JWT_RT_EXPIRES_IN'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // hash refresh token
  async hashRefreshToken(refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(refreshToken, salt);
  }

  // compare refresh token
  async compareRefreshToken(refreshToken: string, hashedRefreshToken: string) {
    return await bcrypt.compare(refreshToken, hashedRefreshToken);
  }

  async verifyAccessToken(token: string) {
    return await this._jwtService.verifyAsync(token);
  }
}
