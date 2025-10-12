import { Column, Entity, OneToMany } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { UserAddressEntity } from './address.entity';

@Entity(EntityNames.USER)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  invite_code: string;

  @Column({ default: 0 })
  score: number;

  @Column({ nullable: true })
  agentId: number;

  @OneToMany(() => UserAddressEntity, (address) => address.user)
  addressList: UserAddressEntity[];
}
