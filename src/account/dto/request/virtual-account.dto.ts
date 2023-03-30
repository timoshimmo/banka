import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class VirtualAccountRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '22222222226' })
  bvn?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1234' })
  reference?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@email.com' })
  email?: string;

  @IsBoolean()
  @ApiProperty({ default: true })
  permanent?: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'providus' })
  provider?: string;
  
}
