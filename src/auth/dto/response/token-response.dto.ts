import { ApiProperty } from '@nestjs/swagger';

import UserResponseDto from './user.response.dto';

export default class TokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: any;

  @ApiProperty()
  message: string;
}
