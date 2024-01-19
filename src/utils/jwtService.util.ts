import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/modules/auth/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTService {
  constructor(
    private _jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // generate refresh and access tokens
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
}
