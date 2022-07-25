import {
  Controller,
  Post,
  Body,
  ConflictException,
  ServiceUnavailableException,
  Req,
  UseGuards,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';
import { AccountService } from 'src/account/account.service';
import CreatePinDto from 'src/account/dto/request/create-pin.dto';

import { LoginDto } from 'src/auth/dto/request/login.dto';
import { OtpVerifyDto } from 'src/auth/dto/request/otp-verify.dto';
import { RegisterDto } from 'src/auth/dto/request/register.dto';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import TokenDto from 'src/auth/dto/response/token-response.dto';
import UserResponseDto from 'src/auth/dto/response/user.response.dto';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserDocument } from 'src/domain/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiResponse(TokenDto, 200)
  async login(@Req() req: Request): Promise<BaseResponse<TokenDto>> {
    const token = await this.authService.login(req.user as ICurrentUser);
    return {
      message: 'Logged in successfully',
      data: token,
      status: HttpStatus.OK,
    };
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
    const result = this.userResponse(createdUser);

    return {
      message: 'User created succesfully',
      data: result,
      status: HttpStatus.CREATED,
    };
  }

  @Post('/otp/verify')
  @ApiBody({ type: OtpVerifyDto })
  @ApiResponse(UserResponseDto, 200)
  @ApiServiceUnavailableResponse({ description: 'Unable to verify otp!' })
  async verify(
    @Body() otp: OtpVerifyDto,
  ): Promise<BaseResponse<UserResponseDto>> {
    const verifiedUser = await this.authService.verifyOtp(otp);
    if (!verifiedUser)
      throw new ServiceUnavailableException('Unable to verify otp!');
    const result = this.userResponse(verifiedUser);
    return { message: 'Otp verified', data: result, status: HttpStatus.OK };
  }

  private userResponse(user: UserDocument) {
    const result: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      isVerified: user.isVerified,
      lastName: user.lastName,
      middleName: user.middleName,
      nickName: user.nickName,
      phoneNumber: user.phoneNumber,
    };
    return result;
  }

  @Post('/pin')
  @ApiBody({ type: CreatePinDto })
  @ApiResponse(String, 200)
  async createPin(@Body() body: CreatePinDto): Promise<BaseResponse<string>> {
    const id = new Types.ObjectId(body.userId);
    const user = await this.accountService.createPin(id, body.pin);
    if (!user) throw new NotFoundException('User not found!');
    return {
      message: 'Pin created',
      data: 'Pin created successfully!',
      status: HttpStatus.CREATED,
    };
  }
}
