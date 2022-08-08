import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/domain/schemas/user/user.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Address, AddressSchema } from 'src/domain/schemas/user/address.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
    ]),
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
