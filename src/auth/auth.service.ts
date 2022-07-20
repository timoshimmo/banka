import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/account.service';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { RegisterDto } from 'src/domain/dto/request/register.dto';
import { OtpService } from 'src/otp/otp.service';
import { UserDocument } from 'src/domain/schemas/user.schema';
import { OtpVerifyDto } from 'src/domain/dto/request/otp-verify.dto';
import TokenDto from 'src/domain/dto/response/token-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.accountService.findOne(email);
    if (user && user.isVerified) {
      if (await bcrypt.compare(password, user.password)) {
        const current: ICurrentUser = {
          email: user.email,
          firstName: user.firstName,
          isVerified: user.isVerified,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          id: user.id,
        };
        return current;
      }
    }
    return null;
  }

  async login(user: ICurrentUser): Promise<TokenDto> {
    const payload = { username: user.phoneNumber, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(data: RegisterDto): Promise<UserDocument> {
    try {
      const user = await this.accountService.create(data);
      if (!user.isVerified)
        await this.otpService.getOtp(user.phoneNumber, user.id);
      return user;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async exist(
    phoneNumber: string,
    email: string,
  ): Promise<{ isExist: boolean; message: string }> {
    let user = await this.accountService.findByPhoneNumber(phoneNumber);
    if (user) {
      return { isExist: true, message: 'Phone number already exist!' };
    }

    user = await this.accountService.findOne(email);
    if (user) {
      return { isExist: true, message: 'Email already exist!' };
    }

    return { isExist: false, message: '' };
  }

  async verifyOtp(otpVerify: OtpVerifyDto): Promise<UserDocument | null> {
    try {
      const isVerified = await this.otpService.verifyOtp(
        otpVerify.pin,
        otpVerify.userId,
      );

      if (isVerified) {
        const user = await this.accountService.verify(otpVerify.userId);
        user.isVerified = true;
        return user;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
