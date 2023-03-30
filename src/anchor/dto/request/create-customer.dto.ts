import { ICurrentUser } from 'src/domain/models/current-user.model';
import { AnchorAddress } from './address.dto';
import { AnchorFullName } from './fullname.dto';

export interface CreateCustomerDto {
    fullName: AnchorFullName;
    address: AnchorAddress;
    phoneNumber: string;
    email: string;
    type: string;
}
/*
export default class CreateCustomerDto {

    fullName: AnchorFullName;
    address: AnchorAddress;
    phoneNumber: string;
    email: string;
    type: string;

    static build(data: ICurrentUser, address: any, type: string): CreateCustomerDto {
        const customer = new CreateCustomerDto();
        customer.fullName.first_name = data.firstName;
        customer.fullName.last_name = data.lastName;
        customer.fullName.middle_name = data.middleName;
        customer.email = data.email;
        customer.phoneNumber = data.phoneNumber;
        customer.address = address;
        customer.type = type;
        return customer;
      }


}*/