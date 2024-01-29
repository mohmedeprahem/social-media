import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { User } from './User.entity';
import { PostsLike } from './PostsLike.entity';

@Table({ tableName: 'posts' })
export class Post extends Model {
  @Column
  description: string;

  @Column({
    defaultValue: 0,
  })
  likesCounter: number;

  @Column({
    defaultValue: 0,
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

  @HasMany(() => PostsLike)
  postLikes: PostsLike[];

  @Column(DataType.VIRTUAL)
  isLiked: boolean;
}
