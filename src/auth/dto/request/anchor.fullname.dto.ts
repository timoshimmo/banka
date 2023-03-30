import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AnchorFullName {
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
  @IsOptional()
  @ApiProperty()
  maidenName?: string;

}
