import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PatchDto } from 'src/account/dto/request/patch.dto';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import UserResponseDto from 'src/auth/dto/response/user.response.dto';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AccountService } from './account.service';
import { AddressDto } from './dto/request/address.dto';
import { NotFoundError } from 'rxjs';

@ApiTags('Account')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch('/profile')
  @ApiBody({ type: [PatchDto] })
  @ApiResponse(UserResponseDto, 200)
  async profile(
    @Req() req: Request,
    @Body() profile: PatchDto[],
  ): Promise<BaseResponse<UserResponseDto>> {
    const user = req.user as ICurrentUser;
    const editedUser = await this.accountService.update(user.id, profile);
    return {
      message: 'User updated successfully',
      data: editedUser,
      status: HttpStatus.OK,
    };
  }

  @Post('/address')
  @ApiBody({ type: AddressDto })
  @ApiResponse(AddressDto, 201)
  async createAddress(
    @Req() req: Request,
    @Body() data: AddressDto,
  ): Promise<BaseResponse<AddressDto>> {
    const user = req.user as ICurrentUser;
    let address = await this.accountService.findAddress(user.id);
    if (address)
      throw new ForbiddenException('Not allowed to have more than one address');

    address = await this.accountService.createAddress(user.id, data);
    return {
      message: 'Address added successfully',
      data: address,
      status: HttpStatus.CREATED,
    };
  }

  @Get('/address')
  @ApiResponse(AddressDto, 200)
  async getAddress(@Req() req: Request): Promise<BaseResponse<AddressDto>> {
    const user = req.user as ICurrentUser;
    const address = await this.accountService.findAddress(user.id);
    if (!address) throw new NotFoundError('Address not found');
    return {
      message: 'Address fetched successfully',
      data: address,
      status: HttpStatus.CREATED,
    };
  }

  @Patch('/address')
  @ApiBody({ type: [PatchDto] })
  @ApiResponse(AddressDto, 200)
  async updateAddress(
    @Req() req: Request,
    @Body() data: PatchDto[],
  ): Promise<BaseResponse<AddressDto>> {
    const user = req.user as ICurrentUser;
    const address = await this.accountService.updateAddress(user.id, data);
    if (!address) throw new NotFoundException('Address not found');
    return {
      message: 'Address Updated successfully',
      data: address,
      status: HttpStatus.OK,
    };
  }
}
