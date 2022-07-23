import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsPhoneNumber('NG')
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase character',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppecase character',
  })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/^(?=.*[!@#%&])/, {
    message: 'Password must contain at least one special character',
  })
  @ApiProperty()
  password: string;

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
  @ApiProperty()
  nickName: string;

  @IsString()
  @ApiProperty()
  referralCode?: string;
}
