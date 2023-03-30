import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CashCardRequestDto {
  @IsNumber()
  @ApiProperty()
  value: Number;

  @IsString()
  @ApiProperty()
  userId: string;
}