import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { OrderItemStatus } from '../enum/status.enum';
import { MenuEntity } from '../../menu/entities/menu.entity';
import { OrderEntity } from './order.entity';

@Entity(EntityNames.ORDER_ITEM)
export class OrderItemEntity extends BaseEntity {
  @Column()
  foodId: number;

  @Column()
  orderId: number;

  @Column()
  count: number;

  @Column()
  supplierId: number;

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.PENDING,
  })
  status: OrderItemStatus;

  @ManyToOne(() => MenuEntity, (menu) => menu.orders, { onDelete: 'CASCADE' })
  food: MenuEntity;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;
}
