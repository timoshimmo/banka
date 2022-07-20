import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import { Entity } from 'src/domain/dto/response/entity';

@Injectable()
export default class TransformInterceptor<T>
  implements NestInterceptor<Entity<T>, BaseResponse<T>>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler<Entity<T>>,
  ): Promise<Observable<BaseResponse<T>>> {
    return next
      .handle()
      .pipe(map((value: Entity<T>) => this.mapResponse(context, value)));
  }

  private mapResponse(
    context: ExecutionContext,
    value: Entity<T>,
  ): BaseResponse<T> {
    return {
      data: value.data,
      statusCode: context.switchToHttp().getResponse().statusCode,
      message: value.message,
    };
  }
}
