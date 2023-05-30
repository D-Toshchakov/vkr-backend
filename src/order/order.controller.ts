import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser, PublicRoute } from 'src/common/decorators';
import { OrderDto } from './dto/order.dto';
import { PaymentStatusDto } from './dto/paymentStatus.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(@GetUser('id') id: number) {
    return this.orderService.getAll(id)
  }
  
  @Post()
  async placeOrder(
    @GetUser('id') userId:number,
    @Body() dto: OrderDto
  ){
    return this.orderService.placeOrder(userId, dto)
  }

  @PublicRoute()
  @Post('status')
  async updateStatus(
    @Body() dto//: PaymentStatusDto
  ) {
    
    return this.orderService.updateStatus(dto)
  }
}
