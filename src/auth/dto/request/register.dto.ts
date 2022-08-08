import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { PersonDto } from './person.dto';

export class RegisterDto extends PersonDto {
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
  nickName: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  referralCode?: string;
}
