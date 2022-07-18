import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { AxiosResponse, AxiosError } from 'axios';

import { OtpResponseDto } from './dto/otp.response.dto';
import { OtpRequestDto } from './dto/otp.request.dto';
import { ConfigService } from '@nestjs/config';
import { TermiiChannel } from './enum/termiiChannel.enum';
import { TermiiMessageType } from './enum/termiiMessageType.enum';
import { Otp, OtpDocument } from 'src/domain/schemas/otp.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OtpVerifyRequestDto } from './dto/otp-verify.request.dto';
import { OtpVerifyResponseDto } from './dto/otp-verify.response.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}

  async getOtp(phoneNumber: string, userId: string): Promise<void> {
    const requestData: OtpRequestDto = this.otpRequest(phoneNumber);
    try {
      this.logger.log('Fetching OTP');
      const response: AxiosResponse<OtpResponseDto> =
        await this.httpService.axiosRef.post('/sms/otp/send', requestData);

      const responseData = response.data;
      if (responseData && responseData.status === 200) {
        this.logger.log('OTP sent!');
        await this.create(userId, responseData.pinId);
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        this.logger.error(err.response.data);
      }
    }
  }

  async verifyOtp(pin: string, userId: string): Promise<boolean> {
    let isVerified = false;
    const sentOtp = await this.findOne(userId);
    const requestData: OtpVerifyRequestDto = {
      api_key: this.configService.get<string>('TERMII_API_KEY'),
      pin,
      pin_id: sentOtp.pinId,
    };

    try {
      this.logger.log('Verifying OTP');
      const response: AxiosResponse<OtpVerifyResponseDto> =
        await this.httpService.axiosRef.post('/sms/otp/verify', requestData);

      const data = response.data;
      if (data && data.verified && data.pinId === sentOtp.pinId) {
        isVerified = true;
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        this.logger.error(err.response.data);
      }
    }
    return isVerified;
  }

  private async findOne(userId: string): Promise<OtpDocument> {
    return await this.otpModel.findOne({ userId });
  }

  private async create(userId: string, pinId: string) {
    const otp = await this.otpModel.findOne({ userId });
    if (otp) {
      return await this.otpModel.findByIdAndUpdate(userId, { pinId });
    }
    const savedOtp = new this.otpModel({ userId, pinId });
    return await savedOtp.save();
  }

  private otpRequest(phoneNumber: string): OtpRequestDto {
    return {
      api_key: this.configService.get<string>('TERMII_API_KEY'),
      channel: TermiiChannel.dnd,
      from: this.configService.get<string>('TERMII_FROM'),
      message_text: this.configService.get<string>('TERMII_MESSAGE_TEXT'),
      message_type: TermiiMessageType.NUMERIC,
      pin_attempts: this.configService.get<number>('TERMII_PIN_ATTEMPTS'),
      pin_length: this.configService.get<number>('TERMII_PIN_LENGTH'),
      pin_placeholder: this.configService.get<string>('TERMII_PIN_PLACEHOLDER'),
      pin_time_to_live: this.configService.get<number>(
        'TERMII_PIN_TIME_TO_LIVE',
      ),
      pin_type: TermiiMessageType.NUMERIC,
      to: phoneNumber.replace('+', ''),
    };
  }
}
