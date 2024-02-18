import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  newEmail: string;
}
