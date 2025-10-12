import { EntityNames } from '../../../common/enum/entity-names.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { UserEntity } from './user.entity';

@Entity(EntityNames.USER_ADDRESS)
export class UserAddressEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.addressList, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
