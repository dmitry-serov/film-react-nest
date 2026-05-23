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
        driver: configService.get<string>('DATABASE_DRIVER', 'postgres'),
        url: configService.get<string>(
          'DATABASE_URL',
          'postgres://localhost:5432/films',
        ),
        username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
        password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
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
