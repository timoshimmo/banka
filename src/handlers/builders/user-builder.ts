import UserResponseDto from 'src/auth/dto/response/user.response.dto';
//import { KinDocument } from 'src/domain/schemas/user/kin.schema';
import { UserDocument } from 'src/domain/schemas/user/user.schema';
//kin: KinDocument

export default class UserBuilder {
  static userResponse(user: UserDocument): UserResponseDto {
    const result: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      isVerified: user.isVerified,
      lastName: user.lastName,
      middleName: user.middleName,
      nickName: user.nickName,
      phoneNumber: user.phoneNumber,
      anchorId: user.anchorId,
      walletId: user.walletId,
      hasTransactionPin: user.transactionPin ? true : false
    };
    return result;
  }
}
