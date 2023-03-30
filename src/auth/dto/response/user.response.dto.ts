import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
//import KinResponseDto from './kin-response.dto';

export default class UserResponseDto {
  @ApiProperty()
  id?: Types.ObjectId;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  middleName: string;

  @IsOptional()
  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ default: false })
  isVerified: boolean;

  @IsOptional()
  @ApiProperty()
  anchorId: string;

  @IsOptional()
  @ApiProperty()
  walletId: string;

  @ApiProperty({ default: false })
  hasTransactionPin: boolean;
}

/*
@ApiProperty()
  nextOfKin: KinResponseDto;
*/
