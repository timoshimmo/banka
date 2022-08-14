import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export default class KinResponseDto {
  @ApiProperty()
  id?: Types.ObjectId;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  relationship: string;
}
