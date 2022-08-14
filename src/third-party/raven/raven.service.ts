import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';
import BankDetailDto from 'src/account/dto/response/bank-detail.dto';

import GenerateAccountDto from './dto/request/generate-account.dto';
import AccountResponseDto from './dto/response/account-response.dto';
import RavenBaseResponseDto from './dto/response/raven-base-response.dto';

@Injectable()
export class RavenService {
  private readonly logger = new Logger(RavenService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async generateAccount(data: GenerateAccountDto): Promise<BankDetailDto> {
    let bankDetail: BankDetailDto = null;
    try {
      this.logger.log('Generating wallet account');
      const response: AxiosResponse<RavenBaseResponseDto<AccountResponseDto>> =
        await this.httpService.axiosRef.post('/pwbt/generate_account', data);
      const responseData = response.data;
      if (responseData && responseData.status === 'success') {
        bankDetail = new BankDetailDto();
        bankDetail.accountNumber = responseData.data.account_number;
        bankDetail.bankName = responseData.data.bank;
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        this.logger.log(err.response.data);
      }
    }
    return bankDetail;
  }
}
