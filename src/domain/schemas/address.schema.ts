import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const AddressSchema = SchemaFactory.createForClass(Address);
