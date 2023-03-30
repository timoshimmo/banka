import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { User } from './user/user.schema';

export type CashCardDocument = CashCard & Document;

@Schema({ versionKey: false })
export class CashCard {

    @Prop({ type: String, required: true })
    cardPin: string;

    @Prop({ type: String })
    refNo: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Number })
    value: Number;

    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    user: Types.ObjectId;
  }
  
  export const CashCardSchema = SchemaFactory.createForClass(CashCard);