import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { SupplierOtpEntity } from './otp.entity';
import { SupplierStatus } from '../enum/status.enum';
import { MenuTypeEntity } from '../../menu/entities/type.entity';
import { MenuEntity } from '../../menu/entities/menu.entity';

@Entity(EntityNames.SUPPLIER)
export class SupplierEntity extends BaseEntity {
  @Column()
  manager_name: string;

  @Column()
  manager_family: string;

  @Column()
  store_name: string;

  @Column()
  phone: string;

  @Column({ default: false })
  mobile_verified: boolean;

  @Column({ nullable: true })
  national_code: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  document: string;

  @Column({
    default: SupplierStatus.REGISTERED,
    type: 'enum',
    enum: SupplierStatus,
  })
  status: SupplierStatus;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, {
    onDelete: 'SET NULL',
  })
  category: CategoryEntity;

  @Column()
  city: string;

  @Column()
  invite_code: string;

  @Column({ nullable: true })
  agentId: number;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.subsets)
  agent: SupplierEntity;

  @OneToMany(() => SupplierEntity, (supplier) => supplier.agent)
  subsets: SupplierEntity[];

  @OneToMany(() => MenuTypeEntity, (menuType) => menuType.supplier)
  menuTypes: MenuTypeEntity[];

  @OneToMany(() => MenuEntity, (menuType) => menuType.supplier)
  menu: MenuEntity[];

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => SupplierOtpEntity, (otp) => otp.supplier)
  @JoinColumn({ name: 'otpId' })
  otp: SupplierOtpEntity;
}
