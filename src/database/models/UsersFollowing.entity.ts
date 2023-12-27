import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User.entity';

@Table
export class UsersFollowing extends Model {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => User)
  @Column
  followingUserId: number;

  @BelongsTo(() => User, 'followingUserId')
  followingUser: User;
}
