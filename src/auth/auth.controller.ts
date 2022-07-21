import {
  Controller,
  Post,
  Body,
  ConflictException,
  ServiceUnavailableException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiExtraModels,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { LoginDto } from 'src/domain/dto/request/auth/login.dto';
import { OtpVerifyDto } from 'src/domain/dto/request/auth/otp-verify.dto';
import { RegisterDto } from 'src/domain/dto/request/auth/register.dto';
import { Response } from 'src/domain/dto/response/response';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import TokenDto from 'src/domain/dto/response/token-response.dto';
import UserResponseDto from 'src/domain/dto/response/user.response.dto';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@ApiExtraModels(Response, UserResponseDto, TokenDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiResponse(TokenDto, 200)
  async login(@Req() req: Request): Promise<BaseResponse<TokenDto>> {
    const token = await this.authService.login(req.user as ICurrentUser);
    return { message: 'Logged in successfully', data: token };
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse(UserResponseDto, 201)
  @ApiConflictResponse({ description: 'User already exists' })
  async register(
    @Body() user: RegisterDto,
  ): Promise<BaseResponse<UserResponseDto>> {
    const isExist = await this.authService.exist(user.phoneNumber, user.email);
    if (isExist.isExist) throw new ConflictException(isExist.message);
    const createdUser = await this.authService.register(user);
    return { message: 'User created succesfully', data: createdUser };
  }

  @Post('/verify')
  @ApiBody({ type: OtpVerifyDto })
  @ApiResponse(UserResponseDto, 200)
  @ApiServiceUnavailableResponse({ description: 'Unable to verify otp!' })
  async verify(
    @Body() otp: OtpVerifyDto,
  ): Promise<BaseResponse<UserResponseDto>> {
    const verifiedUser = await this.authService.verifyOtp(otp);
    if (!verifiedUser)
      throw new ServiceUnavailableException('Unable to verify otp!');
    return { message: 'Otp verified', data: verifiedUser };
  }
}
