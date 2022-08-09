import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import KinResponseDto from './kin-response.dto';

export default class UserResponseDto {
  @ApiProperty()
  id?: Types.ObjectId;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ default: false })
  isVerified: boolean;

  @ApiProperty({ default: false })
  hasTransactionPin: boolean;

  @ApiProperty()
  nextOfKin: KinResponseDto;
}
