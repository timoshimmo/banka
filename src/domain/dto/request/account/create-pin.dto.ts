import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export default class CreatePinDto {
  @IsNumber()
  @Min(6)
  @ApiProperty()
  pin: string;

  @ApiProperty()
  userId: string;
}
