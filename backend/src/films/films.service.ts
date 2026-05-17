import { Injectable } from '@nestjs/common';
import { FilmDto, FilmScheduleDto, ListResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  findAll(): ListResponseDto<FilmDto> {
    return {
      total: 0,
      items: [],
    };
  }

  findSchedule(id: string): ListResponseDto<FilmScheduleDto> {
    void id;

    return {
      total: 0,
      items: [],
    };
  }
}
