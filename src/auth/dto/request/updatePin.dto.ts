import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import PinDto from './pin.dto';

export default class UpdatePinDto extends PinDto {
  @IsNumber()
  @ApiProperty()
  newPin: number;
}
