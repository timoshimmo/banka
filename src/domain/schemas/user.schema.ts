import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
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

  @Prop({ type: Number, length: 6 })
  pin: number;

  @Prop({ type: String, required: true })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
