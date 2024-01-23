import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;
}
