import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export default class CreatePinDto {
  @IsNumber()
  @Min(100000, { message: 'Pin must not be less than 6' })
  @Max(999999, { message: 'Pin must not be more than 6' })
  @ApiProperty()
  pin: number;

  @ApiProperty()
  userId: string;
}
