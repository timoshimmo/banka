import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import CreatePinDto from 'src/domain/dto/request/account/create-pin.dto';
import { ProfileDto } from 'src/domain/dto/request/account/profile.dto';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import UserResponseDto from 'src/domain/dto/response/user.response.dto';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AccountService } from './account.service';

@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/pin')
  @ApiBody({ type: CreatePinDto })
  @ApiResponse(String, 200)
  async createPin(
    @Req() req: Request,
    @Body() body: CreatePinDto,
  ): Promise<string> {
    const user = req.user as ICurrentUser;
    await this.accountService.createPin(user.email, body.pin);
    return 'Pin created successfully!';
  }

  @Put('/profile')
  @ApiBody({ type: ProfileDto })
  @ApiResponse(UserResponseDto, 200)
  @ApiConflictResponse({ description: 'Conflict' })
  async profile(
    @Req() req: Request,
    @Body() profile: ProfileDto,
  ): Promise<BaseResponse<UserResponseDto>> {
    const user = req.user as ICurrentUser;
    const editedUser = await this.accountService.update(user.id, profile);
    return { message: 'User updated successfully', data: editedUser };
  }
}
