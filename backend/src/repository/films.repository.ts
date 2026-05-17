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
}
