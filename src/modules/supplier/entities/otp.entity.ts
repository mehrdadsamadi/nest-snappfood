import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SupplierEntity } from './supplier.entity';
import { EntityNames } from '../../../common/enum/entity-names.enum';

@Entity(EntityNames.SUPPLIER_OTP)
export class SupplierOtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  expires_in: Date;

  @Column()
  supplierId: number;

  @OneToOne(() => SupplierEntity, (supplier) => supplier.otp, {
    onDelete: 'CASCADE',
  })
  supplier: SupplierEntity;
}
