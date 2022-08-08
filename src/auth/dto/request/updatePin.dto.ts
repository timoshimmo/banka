import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';
import PinDto from './pin.dto';

export default class UpdatePinDto extends PinDto {
  @IsNumber()
  @ApiProperty()
  @MaxLength(4)
  newPin: number;
}
