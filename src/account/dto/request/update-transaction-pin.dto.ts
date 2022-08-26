import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import TransactionPinDto from './transaction-pin.dto';

export default class UpdateTransactionPinDto extends TransactionPinDto {
  @IsNumber()
  @ApiProperty()
  @Min(1000, { message: 'New pin must not be less than 4' })
  @Max(9999, { message: 'New oin must not be more than 4' })
  newPin: number;
}
