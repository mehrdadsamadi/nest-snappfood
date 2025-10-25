import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BasketService } from '../basket/basket.service';
import { ZarinpalService } from '../http/zarinpal.service';
import { OrderService } from '../order/order.service';
import { CreatePaymentDto, PaymentGatewayDto } from './dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from '../order/enum/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private req: Request,

    private basketsService: BasketService,

    private zarinpalService: ZarinpalService,

    private orderService: OrderService,

    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async getGatewayUrl(paymentDto: PaymentGatewayDto) {
    const { id: userId } = this.req.user!;

    const basket = await this.basketsService.getBasket();

    const order = await this.orderService.create(basket, paymentDto);

    const payment = await this.create({
      amount: basket.payment_amount,
      orderId: order.id,
      status: basket.payment_amount === 0,
      userId,
      invoice_number: new Date().getTime().toString() + userId,
    });

    if (payment.status) {
      const { authority, code, gatewayURL } =
        await this.zarinpalService.sendRequest({
          amount: basket.payment_amount,
          description: 'PAYMENT ORDER',
          user: {
            email: 'samadimehrdad49@gmail.com',
            mobile: '09371567428',
          },
        });

      payment.authority = authority;
      await this.paymentRepository.save(payment);

      return {
        gatewayURL,
        code,
      };
    }

    return {
      message: 'payment successfully',
    };
  }

  create(paymentDto: CreatePaymentDto) {
    const { amount, invoice_number, orderId, status, userId } = paymentDto;
    const payment = this.paymentRepository.create({
      amount,
      invoice_number,
      orderId,
      status,
      userId,
    });

    return this.paymentRepository.save(payment);
  }

  async verify(authority: string, status: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException('payment not found');

    if (payment.status) throw new ConflictException('payment already verified');

    if (status === 'OK') {
      const order = await this.orderService.findOne(payment.orderId);
      order.status = OrderStatus.PAID;

      await this.orderService.save(order);

      payment.status = true;
    } else {
      return 'http://frontendurl.com/payment?status=failed';
    }

    await this.paymentRepository.save(payment);
    return 'http://frontendurl.com/payment?status=success';
  }
}
