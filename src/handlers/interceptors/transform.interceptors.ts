import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'src/domain/dto/response/response';
import { BaseResponse } from 'src/domain/dto/response/base-response';

@Injectable()
export default class TransformInterceptor<T>
  implements NestInterceptor<BaseResponse<T>, Response<T>>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler<BaseResponse<T>>,
  ): Promise<Observable<Response<T>>> {
    return next
      .handle()
      .pipe(map((value: BaseResponse<T>) => this.mapResponse(value)));
  }

  private mapResponse(value: BaseResponse<T>): Response<T> {
    return {
      data: value.data,
      statusCode: value.status,
      message: value.message,
    };
  }
}
