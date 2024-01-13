import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    unique: true
  })
  uuid: string;

  @Column({
    unique: true
  })
  email: string;

  @Column({
    defaultValue: false
  })
  isEmailPrivate: boolean;

  @Column
  newEmail?: string;

  @Column
  password: string;

  @Column
  fullName: string;

  @Column({
    values: ['male', 'female']
  })
  gender: string;

  @Column
  dateOfBirth: Date;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @Column
  otpCode?: number;

  @Column
  otpCreatedAt?: Date;

  @Column({
    defaultValue: false
  })
  isVerified: boolean;

  @Column({
    defaultValue: 0
  })
  likeCounter: number;

  @Column({
    defaultValue: 0
  })
  commentCounter: number;

}
