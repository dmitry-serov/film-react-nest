import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { FilmsRepository } from './repository/films.repository';
import { Film } from './repository/entities/film.entity';
import { Schedule } from './repository/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.get<string>('DATABASE_DRIVER', 'postgres');

        if (driver !== 'postgres') {
          throw new Error(`Unsupported database driver: ${driver}`);
        }

        return {
          type: 'postgres',
          url: configService.get<string>(
            'DATABASE_URL',
            'postgres://localhost:5432/films',
          ),
          username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
          password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsRepository, FilmsService, OrderService],
})
export class AppModule {}
