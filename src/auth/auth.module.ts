import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from 'src/account/account.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpModule } from 'src/otp/otp.module';
import LocatStrategy from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    AccountModule,
    OtpModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  providers: [AuthService, LocatStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
