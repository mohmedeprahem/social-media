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
      expiresIn: '15m',
    });
    const refreshToken = await this._jwtService.signAsync(payload, {
      secret: this.config.get('JWT_RT_SECRET'),
      expiresIn: '7d',
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
}
