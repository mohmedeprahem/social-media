import { Controller, Post, Body, Req, Res, Get, Param } from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/common/interfaces/IGetUserAuthInfoRequest.interface';
import { ApiBody } from '@nestjs/swagger';

@Controller('api/v1/likes')
export class LikesController {
  constructor() {}
}
