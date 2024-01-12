import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { baseResponseDto } from 'src/shared/dto/baseResponse.dto';
import { UserRepository } from '../../repositories/user.repository';
import  { plainToClass }  from 'class-transformer'
import { User } from '../../database/models/User.entity';
import { PasswordService } from '../../shared/helpers/passwordService.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _passwordService: PasswordService
    ) {}

  async createUser(createUserDto: CreateUserDto): Promise<baseResponseDto> {
    try {
      const user = plainToClass(User, createUserDto);

      // Hash password
      user.password = await this._passwordService.hashPassword(user.password);

      // Create OTP code
      user.otpCode = Math.floor(100000 + Math.random() * 900000);

      // Set OTP creation date
      user.otpCreatedAt = new Date();

      const createdUser = await this._userRepository.create(user.dataValues);

      if(createdUser) {
        // Send OTP

        return {
          success: true,
          status: 201,
          message: 'User created successfully',
        };
      } else {
        console.log(user)
        return {
          success: false,
          status: 400,
          message: 'Error creating user',
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 500,
        message: `Error creating user: ${error.message}`,
      };
    }
  }
}
