import { Controller, Get, Param } from '@nestjs/common';
import { FilmDto, FilmScheduleDto, ListResponseDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(): Promise<ListResponseDto<FilmDto>> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findSchedule(
    @Param('id') id: string,
  ): Promise<ListResponseDto<FilmScheduleDto>> {
    return this.filmsService.findSchedule(id);
  }
}
