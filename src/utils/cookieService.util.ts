import { Response } from 'express';

export class CookieService {
  static setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken);
  }
}
