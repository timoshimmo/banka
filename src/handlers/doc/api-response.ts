import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseResponse } from 'src/domain/dto/response/base-response';

export const ApiResponse = <TModel extends Type<any>>(
  model: TModel,
  status: number,
) => {
  return applyDecorators(
    ApiOkResponse({
      status: status,
      description: 'Success',
      schema: {
        type: 'object',
        allOf: [
          { $ref: getSchemaPath(BaseResponse) },
          {
            properties: {
              message: {
                type: 'string',
              },
              statusCode: {
                type: 'number',
              },
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
