import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jsonpatch from 'fast-json-patch';

import { RegisterDto } from 'src/domain/dto/request/auth/register.dto';
import { User, UserDocument } from 'src/domain/schemas/user.schema';
import { IProfile } from 'src/domain/models/profile.model';

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
    data.email = data.email.toLowerCase().trim();
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

  async createPin(
    id: Types.ObjectId,
    data: number,
  ): Promise<UserDocument | null> {
    const pin = await this.hashedPassword(data.toString());
    const user = await this.userModel.findByIdAndUpdate({ id }, { pin });
    return user;
  }

  async update(id: string, data: any): Promise<UserDocument | null> {
    const profile: IProfile = {};
    const result = jsonpatch.applyPatch(profile, data).newDocument;

    return await this.userModel.findByIdAndUpdate(id, { ...result });
  }
}
