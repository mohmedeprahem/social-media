import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsDate,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Full name must not exceed 255 characters' })
  fullName: string;

  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;

  @ApiProperty({
    example: 'Male',
  })
  @IsEnum(['Male', 'Female'], {
    message: 'Gender must be either Male or Female',
  })
  @IsNotEmpty({ message: 'Gender must not be empty' })
  gender: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Date of birth must not be empty' })
  @Type(() => Date)
  @IsDate({ message: 'Invalid date format for date of birth' })
  dateOfBirth: Date;
}
