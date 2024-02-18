import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../utils';

@Injectable()
export class AuthOrAnonymousMiddleware implements NestMiddleware {
  constructor(private readonly _jwtService: JWTService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Check if an access token is present in the request headers
    const accessToken = req.headers['authorization'];

    if (accessToken) {
      // split the access token from the bearer
      const accessTokenSplit = accessToken.split(' ');

      const payload = await this._jwtService.verifyAccessToken(
        accessTokenSplit[1],
      );

      if (payload) {
        req['user'] = payload;
      } else {
        req['user'] = null;
      }
    } else {
      req['user'] = null;
    }

    next();
  }
}
