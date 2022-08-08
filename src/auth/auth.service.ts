import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/account.service';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { RegisterDto } from 'src/auth/dto/request/register.dto';
import { OtpService } from 'src/otp/otp.service';
import { UserDocument } from 'src/domain/schemas/user/user.schema';
import { OtpVerifyDto } from 'src/auth/dto/request/otp-verify.dto';
import TokenDto from 'src/auth/dto/response/token-response.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.accountService.findOne(email.toLowerCase());
    if (user) {
      const validatePassword = await bcrypt.compare(password, user.password);
      if (validatePassword) {
        return this.mapUser(user);
      }
    }

    return null;
  }

  async currentUser(email: string): Promise<ICurrentUser> {
    const user = await this.accountService.findOne(email);
    if (user && user.isVerified) {
      return this.mapUser(user);
    }
  }

  async login(user: ICurrentUser): Promise<TokenDto> {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
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
        await this.emailService.sendWelcome(user);
        return user;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  private mapUser(user: UserDocument): ICurrentUser {
    const current: ICurrentUser = {
      email: user.email,
      firstName: user.firstName,
      isVerified: user.isVerified,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      pin: user.pin,
      middleName: user.middleName,
      id: user.id,
    };

    return current;
  }
}
