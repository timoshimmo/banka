import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from 'src/domain/dto/request/auth/register.dto';
import { User, UserDocument } from 'src/domain/schemas/user.schema';
import { ProfileDto } from 'src/domain/dto/request/account/profile.dto';

@Injectable()
export class AccountService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ phoneNumber });
  }

  async create(data: RegisterDto): Promise<UserDocument | null> {
    let createdUser = await this.findOne(data.email);
    if (!createdUser) {
      createdUser = await this.findOne(data.phoneNumber);
      if (!createdUser) {
        data.password = await this.hashedPassword(data.password);
        createdUser = new this.userModel(data);
        return await createdUser.save();
      }
    }
  }

  async verify(id: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, { isVerified: true });
  }

  private async hashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async createPin(email: string, pin: string): Promise<UserDocument | null> {
    pin = await this.hashedPassword(pin);
    return await this.userModel.findOneAndUpdate({ email }, { pin });
  }

  async update(id: string, profile: ProfileDto): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, { ...profile });
  }
}
