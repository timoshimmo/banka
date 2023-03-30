import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ versionKey: false })
export class Wallet {
    @Prop({ required: true, type: String })
    userId: string;

    @Prop({ type: String, required: true })
    walletId: string;

    @Prop({ type: String, required: true })
    accountType: string;

    @Prop({ type: String })
    bankId: string;

    @Prop({ type: String })
    bankName: string;

    @Prop({ type: String })
    nipCode: string;

    @Prop({ type: String })
    accountName: string;

    @Prop({ type: String })
    accountNo: string;

    @Prop({ type: String })
    accountStatus: string;

    @Prop({ type: String })
    currency: string;

    @Prop({ type: String })
    createdAt: string;

    @Prop({ type: Number })
    amount: Number;
  }
  
  export const WalletSchema = SchemaFactory.createForClass(Wallet);