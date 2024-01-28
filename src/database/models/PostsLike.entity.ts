import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Post } from './Post.entity';
import { User } from './User.entity';

@Table({ tableName: 'postsLikes', timestamps: false })
export class PostsLike extends Model {
  @ForeignKey(() => User)
  @Column({
    primaryKey: true,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column({
    primaryKey: true,
  })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
