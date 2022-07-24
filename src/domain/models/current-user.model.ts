export interface ICurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  pin: string;
  id?: string;
}
