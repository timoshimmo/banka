import {
  Controller,
  Post,
  Body,
  Param,
  ConflictException,
  ServiceUnavailableException,
  Req,
  UseGuards,
  NotFoundException,
  HttpStatus,
  Logger,
  Put
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
import { CustomerRequestDto } from 'src/auth/dto/request/customer.request.dto';
import { CustomerResponseDto } from 'src/auth/dto/response/customer.response.dto';
import { ApiResponse } from 'src/handlers/doc/api-response';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import UserBuilder from 'src/handlers/builders/user-builder';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiResponse(TokenDto, 200)
  async login(@Body() body: UserResponseDto): Promise<BaseResponse<TokenDto>> {
    const token = await this.authService.login(body);
    return {
      message: 'Logged in successfully',
      data: token,
      status: HttpStatus.OK,
    };
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse(UserResponseDto, 200)
  @ApiConflictResponse({ description: 'User already exists' })
  async register(
    @Body() user: RegisterDto,
  ): Promise<BaseResponse<UserResponseDto>> {
    const isExist = await this.authService.exist(user.phoneNumber, user.email);
    if (isExist.isExist) throw new ConflictException(isExist.message);
    const createdUser = await this.authService.register(user);
    //const kin = await this.accountService.getKin(createdUser.id);
    const result = UserBuilder.userResponse(createdUser);

    return {
      message: 'User created succesfully',
      data: result,
      status: HttpStatus.OK,
    };
  }

  @Put('/anchor/create-customer/:id')
  @ApiBody({ type: CustomerRequestDto })
  @ApiResponse(CustomerResponseDto, 200)
  async registerAnchorCustomer(
    @Param('id') id: string,
    @Body() customerData: CustomerRequestDto
  ): Promise<BaseResponse<CustomerResponseDto>> {

   // const domain = `${req.protocol}://${req.get('Host')}`;
    const result = await this.authService.createCustomer(id, customerData);
    return { message: 'Anchor customer created', data: result, status: HttpStatus.OK };

  }

  @Post('/otp/verify')
  @ApiBody({ type: OtpVerifyDto })
  @ApiResponse(UserResponseDto, 200)
  @ApiServiceUnavailableResponse({ description: 'Unable to verify otp!' })
  async verify(
    @Req() req: Request,
    @Body() otp: OtpVerifyDto,
  ): Promise<BaseResponse<UserResponseDto>> {
    const domain = `${req.protocol}://${req.get('Host')}`;
    const verifiedUser = await this.authService.verifyOtp(otp, domain);
    if (!verifiedUser)
      throw new ServiceUnavailableException('Unable to verify otp!');

    //const kin = await this.accountService.getKin(verifiedUser.id);
    const result = UserBuilder.userResponse(verifiedUser);
    return { message: 'Otp verified', data: result, status: HttpStatus.OK };
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
      status: HttpStatus.OK,
    };
  }


  @Post('/validate/pin')
  @ApiBody({ type: CreatePinDto })
  @ApiResponse(String, 200)
  async validatePin(@Body() body: CreatePinDto): Promise<BaseResponse<any>> {
    const id = new Types.ObjectId(body.userId);
    const user = await this.accountService.validatepin(id, body.pin);
    if (!user) throw new NotFoundException('User not found!');
    return {
      message: 'User validated',
      data: user,
      status: HttpStatus.OK,
    };
  }

}
