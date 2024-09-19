import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({
    default: () => "NOW()"
  })
  createAt: Date;

  @Column({ nullable: true, type: 'varchar', length: 300 })
  createdBy: string;

  @UpdateDateColumn({
    default: () => "NOW()"
  })
  updatedAt: Date;

  @Column({ nullable: true, type: 'varchar', length: 300 })
  updatedBy: string;
}
