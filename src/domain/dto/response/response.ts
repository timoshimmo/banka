import { ApiProperty } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;
}
