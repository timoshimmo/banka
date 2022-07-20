import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @Matches(/^(?=.*[a-z])/, {
    message: 'Must contain at least one lowercase character',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Must contain at least one uppecase character',
  })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Must contain at least one number',
  })
  @Matches(/^(?=.*[!@#%&])/, {
    message: 'Must contain at least one special character',
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
}
