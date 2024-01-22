import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import { HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      // get the token from the cookie
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.extractJWT]),
      secretOrKey: config.get<string>('JWT_RT_SECRET'),
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    const jwt = req && req.cookies ? req.cookies['authorization'] : null;

    if (!jwt) {
      throw new HttpException('Unauthorized', 701);
    }

    return jwt;
  }

  validate(payload: any) {
    const token = RtStrategy.extractJWT;
    return { payload, token };
  }
}
