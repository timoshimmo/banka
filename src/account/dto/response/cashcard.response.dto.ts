import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CashCardResponseDto  {

  @IsString()
  @ApiProperty()
  cardPin: string;

  @IsString()
  @ApiProperty()
  refNo: string;

  @IsNumber()
  @ApiProperty()
  value: Number;

}
