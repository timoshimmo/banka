import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: 'replace' })
  op: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '' })
  value: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '/firstName' })
  path: string;
}
