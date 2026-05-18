import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmDto, FilmScheduleDto, ListResponseDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();

    return {
      total: items.length,
      items,
    };
  }

  async findSchedule(id: string): Promise<ListResponseDto<FilmScheduleDto>> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const items = film.schedule.map((session) => ({
      ...session,
      hall: String(session.hall),
    }));

    return {
      total: items.length,
      items,
    };
  }
}
