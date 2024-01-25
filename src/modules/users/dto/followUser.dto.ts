import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowUserDto {
  @ApiProperty()
  @IsNotEmpty()
  targetUserUuid: string;
}
