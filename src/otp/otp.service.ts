import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { AxiosResponse, AxiosError } from 'axios';

import { OtpResponseDto } from './dto/otp.response.dto';
import { OtpRequestDto } from './dto/otp.request.dto';
import { ConfigService } from '@nestjs/config';
import { TermiiChannel } from './enum/termiiChannel.enum';
import { TermiiMessageType } from './enum/termiiMessageType.enum';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getOtp(phoneNumber: string): Promise<string> {
    let pinId = '';
    const requestData: OtpRequestDto = this.otpRequest(phoneNumber);
    try {
      this.logger.log('Fetching OTP');
      const response: AxiosResponse<OtpResponseDto> =
        await this.httpService.axiosRef.post('/sms/otp/send', requestData);

      const responseData = response.data;
      if (responseData && responseData.status === 200) {
        this.logger.log('OTP sent');
        pinId = responseData.pinId;
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        this.logger.error(err.response.data);
      }
    }

    return pinId;
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
