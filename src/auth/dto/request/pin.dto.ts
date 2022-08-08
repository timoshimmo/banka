import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export default class PinDto {
  @IsNumber()
  @ApiProperty()
  pin: number;
}
