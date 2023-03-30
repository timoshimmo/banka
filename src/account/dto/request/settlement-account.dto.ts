import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class SettlementAccountRequestDto {
  @IsString()
  settlementAccountId?: string;

  @IsString()
  @ApiProperty({ example: 'DepositAccount' })
  type?: string;

}
