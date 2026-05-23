import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmDocument, FilmScheduleDocument } from './film.schema';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDocument[]> {
    const films = await this.filmRepository.find();

    return films.map((film) => this.mapFilm(film, false));
  }

  async findById(id: string): Promise<FilmDocument | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });

    return film ? this.mapFilm(film) : null;
  }

  async findBySession(
    filmId: string,
    sessionId: string,
  ): Promise<FilmDocument | null> {
    const film = await this.filmRepository
      .createQueryBuilder('film')
      .innerJoinAndSelect('film.schedule', 'schedule')
      .where('film.id = :filmId', { filmId })
      .andWhere('schedule.id = :sessionId', { sessionId })
      .getOne();

    return film ? this.mapFilm(film) : null;
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    return this.scheduleRepository.manager.transaction(async (manager) => {
      const schedule = await manager
        .getRepository(Schedule)
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .innerJoin('schedule.film', 'film')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('film.id = :filmId', { filmId })
        .getOne();

      if (!schedule) {
        return false;
      }

      const taken = this.parseList(schedule.taken);

      if (seats.some((seat) => taken.includes(seat))) {
        return false;
      }

      schedule.taken = [...taken, ...seats].join(',');
      await manager.save(schedule);

      return true;
    });
  }

  private mapFilm(film: Film, includeSchedule = true): FilmDocument {
    const result = {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseList(film.tags),
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    } as FilmDocument;

    if (includeSchedule) {
      result.schedule = (film.schedule ?? []).map((session) =>
        this.mapSchedule(session),
      );
    }

    return result;
  }

  private mapSchedule(schedule: Schedule): FilmScheduleDocument {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: this.parseList(schedule.taken),
    };
  }

  private parseList(value: string): string[] {
    if (!value) {
      return [];
    }

    return value.split(',').filter(Boolean);
  }
}
