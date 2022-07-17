import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/domain/schemas/user.schema';

@Injectable()
export class AccountService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userModel.findOne({ phoneNumber });
  }
}
