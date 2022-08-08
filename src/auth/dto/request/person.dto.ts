import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsPhoneNumber, IsString } from 'class-validator';

export class PersonDto {
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
  @IsLowercase()
  email: string;

  @IsPhoneNumber('NG')
  @ApiProperty()
  phoneNumber: string;
}
