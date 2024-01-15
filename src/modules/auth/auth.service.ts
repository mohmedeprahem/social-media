import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { baseResponseDto } from 'src/shared/dto/baseResponse.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { plainToClass } from 'class-transformer';
import { User } from '../../database/models/User.entity';
import { PasswordService } from '../../utils/passwordService.util';
import { MailService } from '../../utils/mail/mail.service';
import { CreateUserError } from 'src/shared/errors/create-user-error';
import { OtpService } from '../../utils/otpService.util';
import { VerifyUserDto } from './dto/verifyUserDto.dto';

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
    user.otpCode = OtpService.generateOtp();

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

  async verifyAccount(verifyUserDto: VerifyUserDto) {
    const { email, otpCode, isNewEmail } = verifyUserDto;
    let user: User;
    user = await this._userRepository.findUser({ email });

    if (!isNewEmail && !user) throw new NotFoundException('User not found');

    if (isNewEmail && user)
      throw new UnauthorizedException('Email already taken');

    if (isNewEmail && !user) {
      user = await this._userRepository.findUser({
        newEmail: email,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    if (user.otpCode !== otpCode || user.otpCreatedAt < new Date())
      throw new BadRequestException('Invalid or expired OTP code');

    user.otpCode = null;
    user.isVerified = true;
    user.email = email;
    user.newEmail = null;

    await this._userRepository.updateUserById({
      ...user.dataValues,
    });
  }
}
