import { BaseEntity } from '../../../common/abstracts/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { UserEntity } from '../../user/entity/user.entity';
import { MenuEntity } from './menu.entity';

@Entity(EntityNames.MENU_FEEDBACK)
export class MenuFeedbackEntity extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  foodId: number;

  @Column()
  comment: string;

  @Column({ type: 'double' })
  score: number;

  @ManyToOne(() => UserEntity, (user) => user.feedbacks, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => MenuEntity, (food) => food.feedbacks, {
    onDelete: 'CASCADE',
  })
  food: MenuEntity;
}
