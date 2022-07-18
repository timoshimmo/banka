import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpVerifyDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  pin: string;
}
