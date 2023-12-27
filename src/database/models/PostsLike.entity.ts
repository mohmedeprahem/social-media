import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Table
export class PostsLike extends Model {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
