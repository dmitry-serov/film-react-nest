import { Inject, Provider } from '@nestjs/common';
import { Connection, createConnection } from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { FilmDocument, FilmSchema } from './film.schema';
import { DATABASE_CONNECTION, FILM_MODEL } from './repository.tokens';

export const databaseProvider: Provider = {
  provide: DATABASE_CONNECTION,
  useFactory: async (config: AppConfig): Promise<Connection> => {
    if (config.database.driver !== 'mongodb') {
      throw new Error(`Unsupported database driver: ${config.database.driver}`);
    }

    return createConnection(config.database.url).asPromise();
  },
  inject: ['CONFIG'],
};

export const filmModelProvider: Provider = {
  provide: FILM_MODEL,
  useFactory: (connection: Connection) =>
    connection.model<FilmDocument>('Film', FilmSchema),
  inject: [DATABASE_CONNECTION],
};

export const InjectFilmModel = () => Inject(FILM_MODEL);
