import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<Pick<OrderService, 'create'>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should create order with data from request body', async () => {
    const order: CreateOrderDto = {
      email: 'user@mail.ru',
      phone: '+79212343234',
      tickets: [
        {
          film: 'film-1',
          session: 'session-1',
          daytime: '12:00',
          row: 1,
          seat: 2,
          price: 350,
        },
      ],
    };
    const response: OrderResponseDto = {
      total: 1,
      items: [
        {
          id: 'ticket-1',
          ...order.tickets[0],
        },
      ],
    };
    service.create.mockResolvedValue(response);

    await expect(controller.create(order)).resolves.toBe(response);
    expect(service.create).toHaveBeenCalledWith(order);
  });
});
