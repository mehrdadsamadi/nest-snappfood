import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BasketService } from '../basket/basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { AuthModule } from '../auth/auth.module';
import { UserBasketEntity } from '../basket/entity/basket.entity';
import { DiscountEntity } from '../discount/entity/discount.entity';
import { MenuEntity } from '../menu/entities/menu.entity';
import { MenuService } from '../menu/services/menu.service';
import { DiscountService } from '../discount/discount.service';
import { MenuTypeEntity } from '../menu/entities/type.entity';
import { MenuTypeService } from '../menu/services/type.service';
import { S3Service } from '../s3/s3.service';
import { OrderEntity } from '../order/entities/order.entity';
import { UserAddressEntity } from '../user/entity/address.entity';
import { OrderService } from '../order/order.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      PaymentEntity,
      UserBasketEntity,
      DiscountEntity,
      MenuEntity,
      MenuTypeEntity,
      OrderEntity,
      UserAddressEntity,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    BasketService,
    MenuService,
    DiscountService,
    MenuTypeService,
    OrderService,
    S3Service,
  ],
})
export class PaymentModule {}
