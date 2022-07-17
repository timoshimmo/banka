import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/account.service';
import { IUser } from 'src/domain/models/user.model';
import { RegisterDto } from 'src/domain/dto/register.dto';
import { OtpService } from 'src/otp/otp.service';

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

  async register(value: RegisterDto) {
    try {
      const existing = await Promise.allSettled([
        this.accountService.findOne(value.email),
        this.accountService.findByPhoneNumber(value.phoneNumber),
      ]);
      if (
        (existing[0].status === 'fulfilled' && existing[0].value) ||
        (existing[1].status === 'fulfilled' && existing[1].value)
      )
        throw new ConflictException(`User already exist!`);

      //send otp
      this.otpService.getOtp(value.phoneNumber);
      //on otp complete
    } catch (error) {
      this.logger.error(error);
    }
  }
}
