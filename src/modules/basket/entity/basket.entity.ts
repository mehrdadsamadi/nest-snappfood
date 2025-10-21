import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { MenuEntity } from '../../menu/entities/menu.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { DiscountEntity } from '../../discount/entity/discount.entity';
import { BasketDiscountType } from '../enum/discount-type';

@Entity(EntityNames.USER_BASKET)
export class UserBasketEntity extends BaseEntity {
  @Column()
  foodId: number;

  @Column()
  userId: number;

  @Column()
  count: number;

  @Column({ enum: BasketDiscountType, type: 'enum', nullable: true })
  discountType: BasketDiscountType;

  @Column({ nullable: true })
  discountId: number;

  @ManyToOne(() => MenuEntity, (menu) => menu.baskets, {
    onDelete: 'CASCADE',
  })
  food: MenuEntity;

  @ManyToOne(() => UserEntity, (user) => user.basket, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {
    onDelete: 'CASCADE',
  })
  discount: DiscountEntity;
}
