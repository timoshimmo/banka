import {
  Controller,
  Request,
  Post,
  Body,
  ConflictException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/domain/dto/request/login.dto';
import { OtpVerifyDto } from 'src/domain/dto/request/otp-verify.dto';
import { RegisterDto } from 'src/domain/dto/request/register.dto';
import UserResponseDto from 'src/domain/dto/response/user.response.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({ type: LoginDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() user: RegisterDto): Promise<UserResponseDto> {
    const isExist = await this.authService.exist(user.phoneNumber, user.email);

    if (isExist) throw new ConflictException('User already exist!');
    const createdUser = await this.authService.register(user);
    if (createdUser && createdUser.isVerified)
      throw new ConflictException('User already exist!');
    return createdUser;
  }

  @Post('/verify')
  @ApiBody({ type: OtpVerifyDto })
  async verify(@Body() otpVerify: OtpVerifyDto): Promise<UserResponseDto> {
    const verifiedUser = await this.authService.verifyOtp(otpVerify);
    if (!verifiedUser)
      throw new ServiceUnavailableException('Unable to verify otp!');
    return verifiedUser;
  }
}
