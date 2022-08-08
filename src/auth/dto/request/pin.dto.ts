import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';

export default class PinDto {
  @IsNumber()
  @ApiProperty()
  @MaxLength(4)
  pin: number;
}
