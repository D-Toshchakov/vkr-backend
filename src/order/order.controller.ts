import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser } from 'src/common/decorators';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(@GetUser('id') id: number) {
    return this.orderService.getAll(id)
  }
}
