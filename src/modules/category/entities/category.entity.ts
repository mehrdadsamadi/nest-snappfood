import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityNames } from '../../../common/enum/entity-names.enum';
import { BaseEntity } from '../../../common/abstracts/base.entity';

@Entity(EntityNames.CATEGORY)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  image: string;

  @Column()
  show: boolean;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    onDelete: 'CASCADE',
  })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];
}
