import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/User.entity';
import { WhereOptions } from 'sequelize';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(user: User): Promise<boolean> {
    await this.userModel.create({ ...user });
    return true;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ where: { email } });
  }

  async updateUserById(user: User): Promise<boolean> {
    await this.userModel.update(user, {
      where: {
        id: user.id,
      },
    });
    return true;
  }

  async findUser(condition: WhereOptions<any>): Promise<User> {
    return await this.userModel.findOne({ where: condition });
  }
}
