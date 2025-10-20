import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';
import { UserAddressEntity } from './address.entity';
import { OtpEntity } from './otp.entity';
import { MenuFeedbackEntity } from '../../menu/entities/feedback.entity';

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

  @Column({ unique: true, nullable: true })
  invite_code: string;

  @Column({ default: false })
  mobile_verified: boolean;

  @Column({ default: 0 })
  score: number;

  @Column({ nullable: true })
  agentId: number;

  @OneToMany(() => UserAddressEntity, (address) => address.user)
  addressList: UserAddressEntity[];

  @OneToMany(() => MenuFeedbackEntity, (feedback) => feedback.user)
  feedbacks: MenuFeedbackEntity[];

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn({ name: 'otpId' })
  otp: OtpEntity;
}
