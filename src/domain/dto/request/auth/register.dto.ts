import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  middleName?: string;

  @IsString()
  @ApiProperty()
  nickName: string;
}
