export default class RavenBaseResponseDto<T> {
  status: string;
  data: T;
  message: string;
}
