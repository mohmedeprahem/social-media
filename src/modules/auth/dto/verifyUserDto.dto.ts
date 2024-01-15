import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyUserDto {
  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'OTP must not be empty' })
  otpCode: string;

  @ApiProperty({
    example: false,
  })
  @IsNotEmpty({ message: 'Is new email must not be empty' })
  isNewEmail: boolean;
}
