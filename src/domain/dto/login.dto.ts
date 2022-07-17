import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  password: string;
}
