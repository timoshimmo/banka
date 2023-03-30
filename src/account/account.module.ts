import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/domain/schemas/user/user.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Address, AddressSchema } from 'src/domain/schemas/user/address.schema';
import { EmailModule } from 'src/email/email.module';
import { AnchorModule } from 'src/anchor/anchor.module';
import { CashCardModule } from 'src/cashcard/cashcard.module';
import Kin, { KinSchema } from 'src/domain/schemas/user/kin.schema';
import { ThirdPartyModule } from 'src/third-party/third-party.module';

@Module({
  imports: [
    EmailModule,
    AnchorModule,
    CashCardModule,
    ThirdPartyModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Kin.name, schema: KinSchema },
    ]),
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
