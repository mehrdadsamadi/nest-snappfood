import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderEntity } from '../../order/entities/order.entity';

@Entity(EntityNames.PAYMENT)
export class PaymentEntity extends BaseEntity {
  @Column({ default: false })
  status: boolean;

  @Column()
  amount: number;

  @Column()
  invoice_number: string;

  @Column({ nullable: true })
  authority: string;

  @Column()
  userId: number;

  @Column()
  orderId: number;

  @ManyToOne(() => UserEntity, (user) => user.payments, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => OrderEntity, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  order: OrderEntity;
}
