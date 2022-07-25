import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PatchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'replace' })
  op: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  value: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  path: string;
}
