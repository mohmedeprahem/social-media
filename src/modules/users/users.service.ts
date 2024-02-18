import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { UsersFollowing } from 'src/database/models/UsersFollowing.entity';
import {
  UserRepository,
  UserFollowingRepository,
} from 'src/database/repositories';
import { OtpService, MailService } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userFollowingRepository: UserFollowingRepository,
    private readonly _mailService: MailService,
  ) {}

  async followUser(userUuid: string, targetUserUuid: string) {
    const targetUser = await this._userRepository.findUser({
      uuid: targetUserUuid,
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new HttpException(null, 500);
    }

    const userFollowing =
      await this._userFollowingRepository.findOneUsersFollowing({
        userId: user.id,
        followingUserId: targetUser.id,
      });

    if (userFollowing) {
      await this._userFollowingRepository.delete(userFollowing);
    } else {
      await this._userFollowingRepository.create(
        new UsersFollowing({
          userId: user.id,
          followingUserId: targetUser.id,
        }),
      );
    }
  }

  async toggleEmailPrivacy(userUuid: string, isEmailPrivate: boolean) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new HttpException(null, 500);
    }

    user.isEmailPrivate = isEmailPrivate;

    await this._userRepository.updateUserById(user);

    return user;
  }

  async getUserInfo(userUuid: string) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new HttpException(null, 500);
    }

    return user;
  }

  async searchUsers(filter: string) {
    const users = await this._userRepository.findUsers({
      [Op.or]: [
        { fullName: { [Op.like]: `%${filter}%` } },
        { email: { [Op.like]: `%${filter}%` } },
      ],
    });

    return users;
  }

  async isFollowing(userUuid: string, targetUserUuid: string) {
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new HttpException(null, 500);
    }

    const targetUser = await this._userRepository.findUser({
      uuid: targetUserUuid,
    });

    if (!targetUser) {
      throw new HttpException(null, 500);
    }

    const userFollowing =
      await this._userFollowingRepository.findOneUsersFollowing({
        userId: user.id,
        followingUserId: targetUser.id,
      });

    return !!userFollowing;
  }

  async updateEmail(userUuid: string, newEmail: string) {
    // check if user exists
    const user = await this._userRepository.findUser({
      uuid: userUuid,
    });

    if (!user) {
      throw new HttpException(null, 500);
    }

    user.newEmail = newEmail;

    // check if email is already taken
    const existingUser = await this._userRepository.findUser({
      email: newEmail,
    });

    console.log(existingUser);
    if (existingUser) {
      throw new ConflictException('Email already taken');
    }

    // generate otp
    const otpCode = OtpService.generateOtp();

    user.otpCode = otpCode;
    user.otpCreatedAt = new Date();

    await this._userRepository.updateUserById(user);

    await this._mailService.sendUserConfirmation(user, otpCode.toString());

    return user;
  }
}
