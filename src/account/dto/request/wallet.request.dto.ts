import { ApiProperty } from '@nestjs/swagger';
//import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { VirtualAccountRequestDto } from './virtual-account.dto';
import { SettlementAccountRequestDto } from './settlement-account.dto';

export class WalletRequestDto {

  @ApiProperty()
  virtualAccountDetail?: VirtualAccountRequestDto;

  @ApiProperty()
  settlementAccount?: SettlementAccountRequestDto;

}
