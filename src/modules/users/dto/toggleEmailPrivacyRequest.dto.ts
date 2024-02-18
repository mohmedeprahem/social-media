import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleEmailPrivacyRequestDto {
  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  isEmailPrivate: boolean;
}
