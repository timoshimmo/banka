import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseResponse } from 'src/domain/dto/response/base-response';

@Injectable()
export default class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponse<T>>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Promise<Observable<BaseResponse<T>>> {
    return next.handle().pipe(map((value) => this.mapResponse(context, value)));
  }

  private mapResponse(context: ExecutionContext, value: T): BaseResponse<T> {
    return {
      data: value,
      statusCode: context.switchToHttp().getResponse().statusCode,
      message: context.switchToHttp().getResponse(),
    };
  }
}
