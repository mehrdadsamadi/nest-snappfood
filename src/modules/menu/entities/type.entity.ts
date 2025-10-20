import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { MenuEntity } from './menu.entity';
import { SupplierEntity } from '../../supplier/entities/supplier.entity';

@Entity(EntityNames.MENU_TYPE)
export class MenuTypeEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  supplierId: number;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menuTypes, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;

  @OneToMany(() => MenuEntity, (food) => food.type)
  items: MenuEntity[];
}
