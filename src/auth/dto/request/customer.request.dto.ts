import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';
import { AnchorFullName } from './anchor.fullname.dto';
import { AnchorAddress } from './anchor.address.dto';

export class CustomerRequestDto  {
  
  @ApiProperty()
  fullName: AnchorFullName;

  @ApiProperty()
  address: AnchorAddress;

  @IsString()
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  type: string;

}
