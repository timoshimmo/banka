export interface ICurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  middleName: string;
  pin: string;
  transactionPin: string;
  id?: string;
}
