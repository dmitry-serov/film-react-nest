import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
  TicketDto,
} from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { FilmScheduleDocument } from '../repository/film.schema';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(order: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = order.tickets ?? [];

    if (tickets.length === 0) {
      throw new BadRequestException('Order must contain tickets');
    }

    const filmId = tickets[0].film;
    const sessionId = tickets[0].session;

    if (!filmId || !sessionId) {
      throw new BadRequestException('Film and session are required');
    }

    if (
      tickets.some(
        (ticket) => ticket.film !== filmId || ticket.session !== sessionId,
      )
    ) {
      throw new BadRequestException('All tickets must use the same session');
    }

    const film = await this.filmsRepository.findBySession(filmId, sessionId);
    const session = film?.schedule.find((item) => item.id === sessionId);

    if (!session) {
      throw new BadRequestException('Session not found');
    }

    const seats = tickets.map((ticket) => this.getSeatKey(ticket));
    const uniqueSeats = new Set(seats);

    if (uniqueSeats.size !== seats.length) {
      throw new BadRequestException('Duplicate seats in order');
    }

    this.validateSeats(tickets, session);

    if (seats.some((seat) => session.taken.includes(seat))) {
      throw new BadRequestException('Seat is already taken');
    }

    const updated = await this.filmsRepository.addTakenSeats(
      filmId,
      sessionId,
      seats,
    );

    if (!updated) {
      throw new BadRequestException('Seat is already taken');
    }

    return {
      total: tickets.length,
      items: tickets.map((ticket) => this.createOrderResult(ticket, session)),
    };
  }

  private getSeatKey(ticket: TicketDto): string {
    return `${ticket.row}:${ticket.seat}`;
  }

  private validateSeats(
    tickets: TicketDto[],
    session: FilmScheduleDocument,
  ): void {
    for (const ticket of tickets) {
      if (
        !Number.isInteger(ticket.row) ||
        !Number.isInteger(ticket.seat) ||
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException('Invalid seat');
      }
    }
  }

  private createOrderResult(
    ticket: TicketDto,
    session: FilmScheduleDocument,
  ): OrderResultDto {
    return {
      id: randomUUID(),
      film: ticket.film,
      session: ticket.session,
      daytime: session.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: session.price,
    };
  }
}
