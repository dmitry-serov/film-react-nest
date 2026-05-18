import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FilmDocument } from './film.schema';
import { InjectFilmModel } from './database.provider';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectFilmModel()
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().select('-_id -__v -schedule').lean().exec();
  }

  findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).select('-_id -__v').lean().exec();
  }

  findBySession(
    filmId: string,
    sessionId: string,
  ): Promise<FilmDocument | null> {
    return this.filmModel
      .findOne({ id: filmId, 'schedule.id': sessionId })
      .select('-_id -__v')
      .lean()
      .exec();
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    // Защита от повторного бронирования уже занятых мест
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: {
              id: sessionId,
              taken: { $nin: seats },
            },
          },
        },
        {
          $addToSet: {
            'schedule.$.taken': { $each: seats },
          },
        },
      )
      .exec();

    return result.modifiedCount === 1;
  }
}
