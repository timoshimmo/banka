import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';
import { ThirdPartyModule } from './third-party/third-party.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<string>('MAIL_HOST'),
          auth: {
            user: configService.get<string>('MAIL_USERNAME'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(undefined, {
            inlineCssOptions: {
              url: `file://` + __dirname + '/templates',
            },
          }),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: __dirname + '/templates/partials',
            options: {
              strict: true,
            },
          },
        },
      }),

      inject: [ConfigService],
    }),
    AuthModule,
    AccountModule,
    OtpModule,
    EmailModule,
    ThirdPartyModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
