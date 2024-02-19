import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailRequestDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Please enter a new email address',
  })
  @IsEmail()
  newEmail: string;
}
