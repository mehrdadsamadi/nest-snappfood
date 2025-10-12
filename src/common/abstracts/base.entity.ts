import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'time with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'time with time zone' })
  updatedAt: Date;
}
