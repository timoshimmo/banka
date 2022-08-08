import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, MaxLength } from 'class-validator';
import TransactionPinDto from './transaction-pin.dto';

export default class UpdateTransactionPinDto extends TransactionPinDto {
  @IsNumber()
  @ApiProperty()
  @MaxLength(4)
  newPin: number;
}
