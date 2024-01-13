import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateUserExceptionFilter } from 'src/shared/filters/create-user-exception.filter';

@ApiTags('User')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly _userService: UserService) {}

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
}
