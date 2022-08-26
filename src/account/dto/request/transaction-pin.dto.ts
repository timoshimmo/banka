import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export default class TransactionPinDto {
  @IsNumber()
  @ApiProperty()
  @Min(1000, { message: 'Pin must not be less than 4' })
  @Max(9999, { message: 'Pin must not be more than 4' })
  pin: number;
}
