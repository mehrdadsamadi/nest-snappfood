import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { OrderStatus } from '../enum/status.enum';
import { UserEntity } from '../../user/entity/user.entity';
import { UserAddressEntity } from '../../user/entity/address.entity';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { OrderItemEntity } from './order-item.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';

@Entity(EntityNames.ORDER)
export class OrderEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column({ nullable: true })
  addressId: number;

  @Column()
  payment_amount: number;

  @Column()
  discount_amount: number;

  @Column()
  total_amount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => UserAddressEntity, (address) => address.orders, {
    onDelete: 'SET NULL',
  })
  address: UserAddressEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];
}
