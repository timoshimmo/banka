import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';

export class CustomerResponseDto  {
  
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  type: string;

  @IsObject()
  @ApiProperty()
  attributes?: any;
}
