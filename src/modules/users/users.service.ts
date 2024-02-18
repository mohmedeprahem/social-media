import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { UsersFollowing } from 'src/database/models/UsersFollowing.entity';
import {
  UserRepository,
  UserFollowingRepository,
} from 'src/database/repositories';

@Injectable()
export class UsersService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userFollowingRepository: UserFollowingRepository,
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
}
