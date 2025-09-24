import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sprints')
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int' })
  createdById: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @Column({ type: 'int', nullable: true })
  teamId: number;

  @Column({ type: 'varchar', nullable: true })
  teamName?: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedDate: Date;
}
