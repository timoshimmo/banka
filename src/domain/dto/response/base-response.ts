export class BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
