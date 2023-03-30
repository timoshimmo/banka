import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from 'src/account/account.service';
import { ICurrentUser } from 'src/domain/models/current-user.model';
import { RegisterDto } from 'src/auth/dto/request/register.dto';
import { OtpService } from 'src/otp/otp.service';
import { AnchorService } from 'src/anchor/anchor.service';
import { UserDocument } from 'src/domain/schemas/user/user.schema';
import { OtpVerifyDto } from 'src/auth/dto/request/otp-verify.dto';
import TokenDto from 'src/auth/dto/response/token-response.dto';
import { EmailService } from 'src/email/email.service';
import UserResponseDto from './dto/response/user.response.dto';
import UserBuilder from 'src/handlers/builders/user-builder';
import { CustomerRequestDto } from 'src/auth/dto/request/customer.request.dto';
import { CustomerResponseDto } from 'src/auth/dto/response/customer.response.dto';
import { ConfigService } from '@nestjs/config';
//import { CreateCustomerDto } from 'src/anchor/dto/request/create-customer.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly anchorService: AnchorService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.accountService.findOne(email.toLowerCase());
    if (user) {
      const validatePassword = await bcrypt.compare(password, user.password);
      if (validatePassword) {
        return this.loggedInUser(user);
      } else {
        const validatedPin = await bcrypt.compare(password, user.pin);
        if (validatedPin) return this.loggedInUser(user);
      }
    }

    return null;
  }

  private async loggedInUser(user: UserDocument): Promise<UserResponseDto> {
    //const kin = await this.accountService.getKin(user.id);
    return UserBuilder.userResponse(user);
  }



  async currentUser(email: string): Promise<ICurrentUser> {
    const user = await this.accountService.findOne(email);
    if (user && user.isVerified) {
      return this.mapUser(user);
    }
  }

 /* async login(email: string, password: string): Promise<TokenDto> {

    try {
      const user = await this.accountService.findOne(email.toLowerCase());
      if(!user) {
        return {
          accessToken: null,
          user: null,
          message: 'Invalid email. Pls try again'
        };
      }
      else {
        const validatePassword = await bcrypt.compare(password, user.password);
        if(!validatePassword) {
          return {
            accessToken: null,
            user: null,
            message: 'Wrong password. Pls try again'
          };
        }
        else {
          const payload = { username: user.email, sub: user.id };
    
          return {
            accessToken: this.jwtService.sign(payload),
            user: user,
            message: 'Logged in successfully'
          };
        }
      }
    }
    catch (error) {
      this.logger.error(error);
    }
  }*/

  async login(user: UserResponseDto): Promise<TokenDto> {
    
    const payload = { username: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, ),
      user: user,
      message: 'Logged in successfully'
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

  async verifyOtp(
    otpVerify: OtpVerifyDto,
    domain: string,
  ): Promise<UserDocument | null> {
    try {
      const isVerified = await this.otpService.verifyOtp(
        otpVerify.pin,
        otpVerify.userId,
      );

      if (isVerified) {
        const user = await this.accountService.verify(otpVerify.userId);
        user.isVerified = true;
        await this.emailService.sendWelcome(user, domain);
        return user;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createCustomer(
    id: string,
    data: CustomerRequestDto
  ): Promise<CustomerResponseDto | null> {

    try {

      const result = await this.anchorService.createCustomer(id, data);
      return result;
    }
    catch(error) {
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
      transactionPin: user.transactionPin,
    };

    return current;
  }
}
