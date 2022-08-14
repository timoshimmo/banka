import { ICurrentUser } from 'src/domain/models/current-user.model';

export default class GenerateAccountDto {
  first_name: string;
  last_name: string;
  phone: string;
  amount: number;
  email: string;

  static build(data: ICurrentUser, amount: number): GenerateAccountDto {
    const account = new GenerateAccountDto();
    account.first_name = data.firstName;
    account.last_name = data.lastName;
    account.amount = amount;
    account.email = data.email;
    account.phone = data.phoneNumber;
    return account;
  }
}
