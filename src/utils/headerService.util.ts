import { Response } from 'express';

export class HeaderService {
  static setJwtHeader(res: Response, token: string): void {
    res.set('Authorization', `Bearer ${token}`);
  }
}
