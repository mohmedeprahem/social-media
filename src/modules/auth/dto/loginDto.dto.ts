import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be empty' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
