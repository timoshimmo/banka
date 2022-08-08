import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jsonpatch from 'fast-json-patch';

import { RegisterDto } from 'src/auth/dto/request/register.dto';
import { User, UserDocument } from 'src/domain/schemas/user/user.schema';
import { IProfile } from 'src/domain/models/profile.model';
import {
  Address,
  AddressDocument,
} from 'src/domain/schemas/user/address.schema';
import { AddressDto } from './dto/request/address.dto';
import { PersonDto } from 'src/auth/dto/request/person.dto';
import Kin, { KinDocument } from 'src/domain/schemas/user/kin.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    @InjectModel(Kin.name)
    private readonly kinModel: Model<KinDocument>,
  ) {}

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
    const user = await this.userModel.findById(id);
    if (user) {
      const profile: IProfile = {
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        nickName: user.nickName,
      };

      const result = jsonpatch.applyPatch(profile, data).newDocument;
      return await this.userModel.findByIdAndUpdate(
        id,
        { ...result },
        { new: true },
      );
    }
  }

  async createAddress(id: string, data: AddressDto): Promise<AddressDto> {
    const address = new this.addressModel({ ...data, user: id });
    const savedAddress = await address.save();
    return this.mapAddress(savedAddress);
  }

  async findAddress(id: string): Promise<AddressDto> {
    const address = await this.addressModel.findOne({ use: id });
    return this.mapAddress(address);
  }

  async updateAddress(id: string, data: any) {
    const address = await this.addressModel.findOne({ user: id });
    if (address) {
      const preparedAddress: AddressDto = {
        city: address.city,
        country: address.country,
        state: address.state,
        street: address.street,
      };

      const result = jsonpatch.applyPatch(preparedAddress, data).newDocument;
      const updateAddress = await this.addressModel.findOneAndUpdate(
        { user: id },
        { ...result },
        { new: true },
      );
      return this.mapAddress(updateAddress);
    }
  }

  private mapAddress(data: AddressDocument): AddressDto {
    return data
      ? {
          city: data.city,
          country: data.country,
          state: data.state,
          street: data.street,
        }
      : null;
  }

  async addKin(id: string, data: PersonDto): Promise<PersonDto> {
    const kin = new this.kinModel({ ...data, user: id });
    const savedKin = await kin.save();
    return this.mapKin(savedKin);
  }

  private mapKin(data: KinDocument): PersonDto {
    return data
      ? {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          middleName: data.middleName,
        }
      : null;
  }
}
