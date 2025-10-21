import { Column, Entity, OneToMany } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { UserBasketEntity } from '../../basket/entity/basket.entity';

@Entity(EntityNames.DISCOUNT)
export class DiscountEntity extends BaseEntity {
  @Column()
  code: string;

  @Column({ type: 'double', nullable: true })
  percent: number;

  @Column({ type: 'double', nullable: true })
  amount: number;

  @Column({ nullable: true })
  expires_in: Date;

  @Column({ nullable: true })
  limit: number;

  @Column({ nullable: true, default: 0 })
  usage: number;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  supplierId: number;

  @OneToMany(() => UserBasketEntity, (basket) => basket.discount)
  baskets: UserBasketEntity[];
}
