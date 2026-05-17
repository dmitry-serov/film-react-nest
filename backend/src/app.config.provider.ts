import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => {
    return {
      database: {
        driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
        url: configService.get<string>(
          'DATABASE_URL',
          'mongodb://localhost:27017/prac',
        ),
      },
    };
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
