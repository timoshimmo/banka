import {
  Controller,
  Request,
  Post,
  Body,
  ConflictException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiExtraModels,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from 'src/domain/dto/request/login.dto';
import { OtpVerifyDto } from 'src/domain/dto/request/otp-verify.dto';
import { RegisterDto } from 'src/domain/dto/request/register.dto';
import { BaseResponse } from 'src/domain/dto/response/base-response';
import { Entity } from 'src/domain/dto/response/entity';
import UserResponseDto from 'src/domain/dto/response/user.response.dto';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@ApiExtraModels(BaseResponse, UserResponseDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: LoginDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse(UserResponseDto, 'User created succesfully', 201)
  @ApiConflictResponse({ description: 'User already exists' })
  async register(@Body() user: RegisterDto): Promise<Entity<UserResponseDto>> {
    const isExist = await this.authService.exist(user.phoneNumber, user.email);
    if (isExist.isExist) throw new ConflictException(isExist.message);
    const createdUser = await this.authService.register(user);
    return { message: 'User created succesfully', data: createdUser };
  }

  @Post('/verify')
  @ApiBody({ type: OtpVerifyDto })
  @ApiResponse(UserResponseDto, 'Otp verified succesfully', 200)
  @ApiServiceUnavailableResponse({ description: 'Unable to verify otp!' })
  async verify(@Body() otp: OtpVerifyDto): Promise<Entity<UserResponseDto>> {
    const verifiedUser = await this.authService.verifyOtp(otp);
    if (!verifiedUser)
      throw new ServiceUnavailableException('Unable to verify otp!');
    return { message: 'Otp verified', data: verifiedUser };
  }
}
