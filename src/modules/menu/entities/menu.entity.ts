import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { SupplierEntity } from '../../supplier/entities/supplier.entity';
import { MenuTypeEntity } from './type.entity';
import { MenuFeedbackEntity } from './feedback.entity';

@Entity(EntityNames.MENU)
export class MenuEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  imageKey: string;

  @Column({ type: 'double' })
  price: number;

  @Column({ type: 'double', default: 0 })
  discount: number;

  @Column()
  description: string;

  @Column({ type: 'double', default: 0 })
  score: number;

  @Column()
  typeId: number;

  @Column()
  supplierId: number;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menu, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;

  @ManyToOne(() => MenuTypeEntity, (type) => type.items)
  type: MenuTypeEntity;

  @OneToMany(() => MenuFeedbackEntity, (score) => score.food)
  feedbacks: MenuFeedbackEntity[];
}
