import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PersonDto } from './person.dto';

export default class KinDto extends PersonDto {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  relationship: string;
}
