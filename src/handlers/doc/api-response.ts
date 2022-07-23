import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'src/domain/dto/response/response';
import TokenDto from 'src/domain/dto/response/token-response.dto';
import UserResponseDto from 'src/domain/dto/response/user.response.dto';

export const ApiResponse = <TModel extends Type<any>>(
  model: TModel,
  status: number,
) => {
  return applyDecorators(
    ApiExtraModels(Response, UserResponseDto, TokenDto, String),
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
