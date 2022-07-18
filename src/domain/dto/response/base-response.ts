export interface BaseResponse<T> {
  statusCode: number;
  data: T;
}
