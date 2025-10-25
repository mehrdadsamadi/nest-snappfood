import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { BasketType } from '../basket/basket.type';
import { UserAddressEntity } from '../user/entity/address.entity';
import { OrderItemStatus, OrderStatus } from './enum/status.enum';
import { OrderItemEntity } from './entities/order-item.entity';
import { PaymentGatewayDto } from '../payment/dto/payment.dto';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject(REQUEST) private req: Request,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(UserAddressEntity)
    private userAddressRepository: Repository<UserAddressEntity>,

    private dataSource: DataSource,
  ) {}

  async create(basket: BasketType, paymentDto: PaymentGatewayDto) {
    const { addressId, description } = paymentDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const { id: userId } = this.req.user!;

      const address = await this.userAddressRepository.findOneBy({
        id: addressId,
        userId,
      });
      if (!address) throw new NotFoundException('address not found');

      const { foods, payment_amount, total_amount, total_discount } = basket;

      let order = queryRunner.manager.create(OrderEntity, {
        addressId,
        userId,
        total_amount,
        description,
        discount_amount: total_discount,
        payment_amount,
        status: OrderStatus.PENDING,
      });

      order = await queryRunner.manager.save(OrderEntity, order);

      const orderItems: DeepPartial<OrderItemEntity>[] = [];
      for (const food of foods) {
        orderItems.push({
          count: food.count,
          foodId: food.foodId,
          orderId: order.id,
          status: OrderItemStatus.PENDING,
          supplierId: food.supplierId,
        });
      }
      if (orderItems.length > 0) {
        await queryRunner.manager.save(OrderItemEntity, orderItems);
      } else {
        throw new BadRequestException('your food list is empty');
      }

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('order not found');
    return order;
  }

  save(order: OrderEntity) {
    return this.orderRepository.save(order);
  }
}
