import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerType } from './enum/customerType.enum';
import { VirtualAccountType } from './enum/virtualBanks.enum';
import { AxiosResponse, AxiosError } from 'axios';
import { User, UserDocument } from 'src/domain/schemas/user/user.schema';
import { Wallet, WalletDocument } from 'src/domain/schemas/wallet.schema';
import { CustomerResponseDto } from 'src/auth/dto/response/customer.response.dto';
import { CustomerRequestDto } from 'src/auth/dto/request/customer.request.dto';
import { WalletRequestDto } from 'src/account/dto/request/wallet.request.dto';
import { WalletResponseDto } from 'src/account/dto/response/wallet.response.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AnchorService {

    private readonly logger = new Logger(AnchorService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async createCustomer(id: string, body: CustomerRequestDto): Promise<any> {

        const requestData: any = this.mapCustomer(body);

        try {

            const response: AxiosResponse<CustomerResponseDto> =
            await this.httpService.axiosRef.post('/customers', requestData);
            const responseData = response.data;

            await this.userModel.findOneAndUpdate(
                { _id: id }, 
                { anchorId: responseData["data"].id },
                { new: true },);
            
            return responseData;

        }
        catch (error) {
            const err = error as AxiosError;
            if (err.response) {
              this.logger.error(err.response.data);
            }
        }
    }

    async createWalletAccount(id: string, body: WalletRequestDto): Promise<any> {

        const requestData: any = this.mapVirtualAccount(body);

        try {

            const response: AxiosResponse<WalletResponseDto> =
            await this.httpService.axiosRef.post('/virtual-nubans', requestData);
            const responseData = response.data;

            //this.logger.log("Virtual Account: ", responseData);

            const walletData = {
                userId: id,
                walletId: responseData.id,
                accountType: responseData.type,
                bankId: responseData.attributes.bank.id,
                bankName: responseData.attributes.bank.name,
                nipCode: responseData.attributes.bank.nipCode,
                accountName: responseData.attributes.accountName,
                accountNo: responseData.attributes.accountNo,
                accountStatus: responseData.attributes.status,
                currency: responseData.attributes.currency,
                createdAt: responseData.attributes.createdAt,
                amount: 0
            }

            const newWallet = new this.walletModel(walletData);
            await newWallet.save();

           /* await this.userModel.findOneAndUpdate(
                { _id: id }, 
                { walletId: responseData["data"].id },
                { new: true }
            );*/
            
            return responseData;

        }
        catch (error) {
            const err = error as AxiosError;
            if (err.response) {
              this.logger.error(err.response.data);
            }
        }
    }

    async getWalletAccount(id: string): Promise<any> {

        try {

            const response: AxiosResponse<WalletResponseDto> =
            await this.httpService.axiosRef.get(`/virtual-nubans/${id}`);
            const responseData = response.data;

            this.logger.log("Get Wallet: ", responseData);

            return responseData;


        }
        catch (error) {
            const err = error as AxiosError;
            if (err.response) {
              this.logger.error(err.response.data);
            }
        }
    }

    private mapVirtualAccount(wallet: WalletRequestDto): any {

        let result = {};

        const virtualAccountDetail = {
            name: wallet.virtualAccountDetail.name,
            bvn: wallet.virtualAccountDetail.bvn,
            reference: wallet.virtualAccountDetail.reference,
            email: wallet.virtualAccountDetail.email,
            permanent: wallet.virtualAccountDetail.permanent
        };

        const attributes = {
            virtualAccountDetail: virtualAccountDetail,
            provider: wallet.virtualAccountDetail.provider
        };

        const settlementData = {
            id: this.configService.get<string>('SETTLEMENT_ACCOUNT_ID'),
            type: wallet.settlementAccount.type
        }

        const settlementAccount = {
            data: settlementData
        }

        const relationships = {
            settlementAccount: settlementAccount
        }

        let data = {
            attributes: attributes,
            relationships: relationships,
            type: VirtualAccountType.VIRTUALNUBAN
        }

        result['data'] = data; 

        return result;

    }


    private mapCustomer(customer: CustomerRequestDto): any {
        let result = {};
        //let attributes = {};
        
        let attributes = {
            fullName: customer.fullName,
            address: customer.address,
            email: customer.email,
            phoneNumber: customer.phoneNumber
        };

        let data = {
            attributes: attributes,
            type: CustomerType.INDIVIDUAL_CUSTOMER
        }

        result['data'] = data; 
       // this.logger.log('CREATE CUSTOMER RESULT: ', result);
        

        return result;

    }

}