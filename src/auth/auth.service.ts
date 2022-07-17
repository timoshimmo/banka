import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/account.service';
import { IUser } from 'src/domain/models/user.model';
import { RegisterDto } from 'src/domain/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
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

  async register(value: RegisterDto) {}
}
