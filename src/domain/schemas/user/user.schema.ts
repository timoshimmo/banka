import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop(String)
  middleName: string;

  @Prop(String)
  nickName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  pin: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop(String)
  anchorId: string;

  @Prop(String)
  walletId: string;

  @Prop({ type: String })
  transactionPin: string;

  @Prop({ type: Boolean, default: false })
  hasTransactionPin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
