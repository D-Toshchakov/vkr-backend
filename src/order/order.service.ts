import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDto } from './dto/order.dto';
import { ICreatePayment, YooCheckout } from '@a2seven/yoo-checkout'; // OR const { YooCheckout } = require('@a2seven/yoo-checkout');
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { PaymentStatusDto } from './dto/paymentStatus.dto';

const checkout = new YooCheckout({ shopId: process.env.SHOP_ID, secretKey: process.env.PAYMENT_SECRET });

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }


    async getAll(userId: number) {
        const orders = await this.prisma.order.findMany({
            where: { id: userId },
            orderBy: { createdAt: 'desc' }
        })
        return orders
    }

    async placeOrder(userId: number, dto: OrderDto) {
        const total = dto.items.reduce((price, item) => {
            return price + item.price * item.quantity
        }, 0)

        const order = await this.prisma.order.create({
            data: {
                status: dto.status,
                items: {
                    create: dto.items
                },
                total,
                user: {
                    connect: { id: userId }
                }
            }
        })

        // const checkout = new YooCheckout({ shopId: process.env.SHOP_ID, secretKey: process.env.PAYMENT_SECRET });

        const idempotenceKey = uuidv4()

        const createPayload: ICreatePayment = {
            amount: {
                value: total.toFixed(2),
                currency: 'RUB'
            },
            payment_method_data: {
                type: 'bank_card'
            },
            confirmation: {
                type: 'redirect',
                return_url: 'http://localhost:3000/thanks'
            },
            description: `Order ${order.id}`,
            metadata: { orderId: order.id }
        };

        try {
            const payment = await checkout.createPayment(createPayload, idempotenceKey)

            console.log(payment);
            return payment
        } catch (error) {
            console.error('ERROR', error);
            throw new BadRequestException('payment failed')
        }
    }

    async updateStatus(dto: PaymentStatusDto) {
        console.log(dto);

        if (dto.event === 'payment.waiting_for_capture') {
            try {
                // const idempotenceKey = uuidv4()
                const payment = await checkout.capturePayment(dto.object.id, dto.object)
                console.log('CAPTURED PAYMENT');
                return payment
            } catch (error) {
                console.error(error);
            }
        }
        if (dto.event === 'payment.succeeded') {
            console.log('success');

            const order = await this.prisma.order.update({
                where: { id: +dto.object.metadata.orderId},
                data: {
                    status: 'PAID'
                }
            })

            return true
        }
        return true
    }
}
