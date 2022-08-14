import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RavenService } from './raven/raven.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
        baseURL: configService.get<string>('RAVEN'),
        headers: {
          Authorization:
            'Bearer ' + configService.get<string>('RAVEN_SECRET_KEY'),
          'Content-Type': 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RavenService],
  providers: [RavenService],
})
export class ThirdPartyModule {}
