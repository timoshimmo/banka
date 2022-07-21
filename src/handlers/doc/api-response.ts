import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'src/domain/dto/response/response';

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
          { $ref: getSchemaPath(Response) },
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
