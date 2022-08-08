import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Kin & Document;

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
}

export const KinSchema = SchemaFactory.createForClass(Kin);
