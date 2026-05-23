import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => {
    return {
      port: configService.get<number>('PORT', 3000),
      database: {
        driver: configService.get<string>('DATABASE_DRIVER', 'mongodb'),
        url: configService.get<string>(
          'DATABASE_URL',
          'mongodb://localhost:27017/prac',
        ),
        username: configService.get<string>('DATABASE_USERNAME', ''),
        password: configService.get<string>('DATABASE_PASSWORD', ''),
      },
    };
  },
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
