import { ApiProperty } from '@nestjs/swagger';
import { ICurrentUser } from 'src/domain/models/current-user.model';

export default class TokenDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: ICurrentUser;
}
