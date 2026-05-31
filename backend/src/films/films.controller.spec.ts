import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, FilmScheduleDto, ListResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<Pick<FilmsService, 'findAll' | 'findSchedule'>>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should return films from service', async () => {
    const response: ListResponseDto<FilmDto> = {
      total: 1,
      items: [
        {
          id: 'film-1',
          rating: 8.5,
          director: 'Director',
          tags: ['drama'],
          title: 'Film title',
          about: 'Film about',
          description: 'Film description',
          image: 'image.jpg',
          cover: 'cover.jpg',
        },
      ],
    };
    service.findAll.mockResolvedValue(response);

    await expect(controller.findAll()).resolves.toBe(response);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return film schedule by film id', async () => {
    const response: ListResponseDto<FilmScheduleDto> = {
      total: 1,
      items: [
        {
          id: 'schedule-1',
          daytime: '12:00',
          hall: '1',
          rows: 10,
          seats: 12,
          price: 350,
          taken: ['1:1'],
        },
      ],
    };
    service.findSchedule.mockResolvedValue(response);

    await expect(controller.findSchedule('film-1')).resolves.toBe(response);
    expect(service.findSchedule).toHaveBeenCalledWith('film-1');
  });
});
