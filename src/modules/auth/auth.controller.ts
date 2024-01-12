import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/v1/auth')

export class AuthController {
  constructor(private readonly _userService : UserService) {}
  @Post("/register")
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
 })
  async register(@Body() body : CreateUserDto) : Promise<object> {
    try {

      const user = await this._userService.createUser(body);

      return user;
    } catch (error) {
      return {
        success: true,
        status: 500,
        message: "Server error",
      }
    }
  }
}
