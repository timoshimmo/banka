import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AnchorAddress {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NG' })
  country?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Mushin' })
  city?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sijuade' })
  addressLine_1?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lagos' })
  state?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '100223' })
  postalCode?: string;
}
