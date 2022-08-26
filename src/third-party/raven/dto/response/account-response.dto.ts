import CustomerResponseDto from './customer-response.dto';

export default class AccountResponseDto {
  account_number: string;
  account_name: string;
  bank: string;
  customer: CustomerResponseDto;
  isPermanent: boolean;
  amount: string;
}
