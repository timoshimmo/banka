import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';

export default class UpdatePinDto {
  @IsNumber()
  @ApiProperty()
  @MaxLength(4)
  pin: number;

  @IsNumber()
  @ApiProperty()
  @MaxLength(4)
  newPin: number;
}
