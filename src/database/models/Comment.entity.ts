import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Table
export class Comment extends Model {
  @Column
  description: string;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User, 'userId')
  user: User;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post, 'postId')
  post: Post;
}
