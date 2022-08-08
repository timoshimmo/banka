import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type KinDocument = Kin & Document;

@Schema()
export default class Kin {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop(String)
  middleName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  relationShip: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;
}

export const KinSchema = SchemaFactory.createForClass(Kin);
