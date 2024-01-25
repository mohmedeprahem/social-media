import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User.entity';

@Table({
  tableName: 'usersFollowing',
  timestamps: false,
})
export class UsersFollowing extends Model {
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
  })
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
  })
  followingUserId: number;

  @BelongsTo(() => User, 'followingUserId')
  followingUser: User;
}
