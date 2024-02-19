import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { plainToClass } from 'class-transformer';
import { User } from '../../database/models/User.entity';
import { CreateUserError } from 'src/common/errors/create-user-error';
import { VerifyUserDto } from './dto/verifyUserDto.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  JWTService,
  OtpService,
  MailService,
  PasswordService,
} from 'src/utils';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _passwordService: PasswordService,
    private readonly _mailService: MailService,
    private readonly _jwtService: JWTService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this._userRepository.findUser({
      email,
    });

    const otpCode = OtpService.generateOtp();

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new CreateUserError('User already existed', false);
      }

      existingUser.otpCode = otpCode;
      existingUser.otpCreatedAt = new Date();

      const userUpdated = await this._userRepository.updateUserById(
        existingUser.dataValues,
      );

      if (!userUpdated) {
        throw new Error('Error updating user');
      }

      await this._mailService.sendUserConfirmation(
        existingUser,
        existingUser.otpCode.toString(),
      );

      throw new CreateUserError('User already existed', true);
    } else {
      let user = plainToClass(User, createUserDto);
      user.otpCode = otpCode;
      user.otpCreatedAt = new Date();
      user.password = await this._passwordService.hashPassword(password);
      user.uuid = uuidv4();

      const userCreated = await this._userRepository.create(user.dataValues);

      if (!userCreated) {
        throw new Error('Error creating user');
      }

      await this._mailService.sendUserConfirmation(
        user,
        user.otpCode.toString(),
      );

      return {
        success: true,
        isOTPSent: true,
      };
    }
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

    const expirationTime = 5 * 60 * 1000;
    const currentTime = new Date().getTime();
    const tokenCreationTime = user.otpCreatedAt.getTime();

    if (
      user.otpCode !== otpCode ||
      currentTime - tokenCreationTime > expirationTime
    )
      throw new BadRequestException('Invalid or expired OTP code');

    user.otpCode = null;
    user.isVerified = true;
    user.email = email;
    user.newEmail = null;

    const jwtToken = await this._jwtService.generateTokens({
      sub: user.uuid,
      email: user.email,
    });

    user.refreshToken = await this._jwtService.hashRefreshToken(
      jwtToken.refreshToken,
    );

    await this._userRepository.updateUserById(user);
    return jwtToken;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this._userRepository.findUser({
      email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      const otpCode = OtpService.generateOtp();
      user.otpCode = otpCode;
      user.otpCreatedAt = new Date();
      await this._userRepository.updateUserById({
        ...user.dataValues,
      });

      await this._mailService.sendUserConfirmation(
        user,
        user.otpCode.toString(),
      );
      throw new UnprocessableEntityException("User isn't verified");
    }

    const isPasswordValid = await this._passwordService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Bad request');
    }

    const jwtToken = await this._jwtService.generateTokens({
      sub: user.uuid,
      email: user.email,
    });

    user.refreshToken = await this._jwtService.hashRefreshToken(
      jwtToken.refreshToken,
    );

    await this._userRepository.updateUserById(user);

    return jwtToken;
  }

  async logout(userUuid: string) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new Error();
    }

    user.refreshToken = null;

    await this._userRepository.updateUserById({
      ...user.dataValues,
    });
  }

  async resendOTP(email: string) {
    const user = await this._userRepository.findUser({
      email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpCode = OtpService.generateOtp();

    user.otpCode = otpCode;
    user.otpCreatedAt = new Date();
    await this._userRepository.updateUserById({
      ...user.dataValues,
    });

    await this._mailService.sendUserConfirmation(user, user.otpCode.toString());
  }

  async refreshToken(userUuid: string, refreshToken: string) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException();
    }

    if (
      !this._jwtService.compareRefreshToken(refreshToken, user.refreshToken)
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const jwtToken = await this._jwtService.generateTokens({
      sub: user.uuid,
      email: user.email,
    });

    user.refreshToken = await this._jwtService.hashRefreshToken(
      jwtToken.refreshToken,
    );

    await this._userRepository.updateUserById({
      ...user.dataValues,
    });

    return jwtToken;
  }
}
