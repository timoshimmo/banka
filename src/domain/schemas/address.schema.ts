import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

export type AddressDocument = Address & Document;

@Schema()
export class Address {
  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
