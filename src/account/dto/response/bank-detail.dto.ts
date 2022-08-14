import { ApiProperty } from '@nestjs/swagger';

export default class BankDetailDto {
  @ApiProperty()
  bankName: string;
  @ApiProperty()
  accountNumber: string;
}
