import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/domain/schemas/user/user.schema';
import { Wallet, WalletSchema } from 'src/domain/schemas/wallet.schema';
import { AnchorService } from './anchor.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Wallet.name, schema: WalletSchema }
        ]),
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async(configService: ConfigService) => ({
                timeout: configService.get('HTTP_TIMEOUT'),
                maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
                baseURL: configService.get<string>('ANCHOR_BASEURL'),
                headers: {
                'Content-Type': 'application/json',
                'x-anchor-key': configService.get('ANCHOR_API_KEY')
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AnchorService],
    exports: [AnchorService],

})

export class AnchorModule {}