import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nigeria' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Mushin' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sijuade' })
  street: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lagos' })
  state: string;
}
