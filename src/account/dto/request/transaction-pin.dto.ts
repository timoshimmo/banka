import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';

export default class TransactionPinDto {
  @IsNumber()
  @ApiProperty()
  @MaxLength(4)
  pin: number;
}
