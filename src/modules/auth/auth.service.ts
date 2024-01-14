import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { baseResponseDto } from 'src/shared/dto/baseResponse.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { plainToClass } from 'class-transformer';
import { User } from '../../database/models/User.entity';
import { PasswordService } from '../../utils/passwordService.util';
import { MailService } from '../../utils/mail/mail.service';
import { CreateUserError } from 'src/shared/errors/create-user-error';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _passwordService: PasswordService,
    private readonly _mailService: MailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = plainToClass(User, createUserDto);

    // Hash password
    user.password = await this._passwordService.hashPassword(password);

    // Create OTP code
    user.otpCode = Math.floor(100000 + Math.random() * 900000);

    // Set OTP creation date
    user.otpCreatedAt = new Date();

    // Check if email is already in use
    const existingUser = await this._userRepository.findByEmail(email);

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new CreateUserError('User already existed', false);
      }

      const userUpdated = await this._userRepository.updateUserById(
        user.dataValues,
      );

      if (!userUpdated) {
        throw new Error('Error updating user');
      }

      // Send OTP email
      await this._mailService.sendUserConfirmation(
        user,
        user.otpCode.toString(),
      );

      throw new CreateUserError('User already existed', true);
    }

    const userCreated = await this._userRepository.create(user.dataValues);

    if (!userCreated) {
      throw new Error('Error creating user');
    }

    // Send OTP email
    await this._mailService.sendUserConfirmation(user, user.otpCode.toString());

    return {
      success: true,
      isOTPSent: true,
    };
  }
}
