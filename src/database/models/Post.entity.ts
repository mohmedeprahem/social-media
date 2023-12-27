import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User.entity';

@Table
export class Post extends Model {

  @Column
  description: string;

  @Column({
    defaultValue: 0
  })
  likesCounter: number;

  @Column({
    defaultValue: 0
  })
  commentsCounter: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
