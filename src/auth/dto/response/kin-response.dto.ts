import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export default class KinResponseDto {
  @ApiProperty()
  id?: Types.ObjectId;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
