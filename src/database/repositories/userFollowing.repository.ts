import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersFollowing } from '../models/UsersFollowing.entity';
import { Includeable, WhereOptions } from 'sequelize';

@Injectable()
export class UserFollowingRepository {
  constructor(
    @InjectModel(UsersFollowing)
    private readonly usersFollowingModel: typeof UsersFollowing,
  ) {}

  async create(usersFollowing: UsersFollowing): Promise<boolean> {
    await this.usersFollowingModel.create({
      userId: usersFollowing.userId,
      followingUserId: usersFollowing.followingUserId,
    });
    return true;
  }

  async findOneUsersFollowing(
    condition: WhereOptions<any>,
  ): Promise<UsersFollowing> {
    return await this.usersFollowingModel.findOne({
      where: condition,
    });
  }

  async delete(usersFollowing: UsersFollowing): Promise<number> {
    return await this.usersFollowingModel.destroy({
      where: {
        userId: usersFollowing.userId,
        followingUserId: usersFollowing.followingUserId,
      },
    });
  }

  async getFollowedUsers(userId: number): Promise<UsersFollowing[]> {
    return await this.usersFollowingModel.findAll({
      where: {
        userId,
      },
    });
  }

  async findUsersFollowings(
    condition: WhereOptions<any>,
    include: string[] = [],
  ): Promise<UsersFollowing[]> {
    const includeOptions: Includeable[] = include.map((assoc) => ({
      model: this.usersFollowingModel.associations[assoc].target,
      as: assoc,
    }));
    return await this.usersFollowingModel.findAll({
      where: condition,
      include: includeOptions,
    });
  }
}
