import UserResponseDto from 'src/auth/dto/response/user.response.dto';
import { KinDocument } from 'src/domain/schemas/user/kin.schema';
import { UserDocument } from 'src/domain/schemas/user/user.schema';

export default class UserBuilder {
  static userResponse(user: UserDocument, kin: KinDocument): UserResponseDto {
    const result: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      isVerified: user.isVerified,
      lastName: user.lastName,
      middleName: user.middleName,
      nickName: user.nickName,
      phoneNumber: user.phoneNumber,
      hasTransactionPin: user.transactionPin ? true : false,
      nextOfKin: {
        firstName: kin?.firstName,
        lastName: kin?.lastName,
        id: kin?.id,
        address: kin?.address,
        email: kin.email,
        middleName: kin.middleName,
        phoneNumber: kin.phoneNumber,
        relationship: kin.relationship,
      },
    };
    return result;
  }
}
