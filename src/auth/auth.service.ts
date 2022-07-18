import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/account.service';
import { IUser } from 'src/domain/models/user.model';
import { RegisterDto } from 'src/domain/dto/request/register.dto';
import { OtpService } from 'src/otp/otp.service';
import { UserDocument } from 'src/domain/schemas/user.schema';
import { OtpVerifyDto } from 'src/domain/dto/request/otp-verify.dto';

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
    if (user && (await bcrypt.compare(password, user.password))) {
      const current: IUser = { ...user };
      return current;
    }
    return null;
  }

  async login(user: any) {
    const payload = { phoneNumber: user.phoneNumber, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
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

  async exist(phoneNumber: string, email: string): Promise<boolean> {
    let isExist = false;
    const response = await Promise.all([
      this.accountService.findByPhoneNumber(phoneNumber),
      this.accountService.findOne(email),
    ]);

    if (
      (response[0] && response[0].isVerified) ||
      (response[1] && response[1].isVerified)
    )
      isExist = true;
    return isExist;
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
