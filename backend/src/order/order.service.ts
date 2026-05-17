import { Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  create(order: CreateOrderDto): OrderResponseDto {
    void order;

    return {
      total: 0,
      items: [],
    };
  }
}
