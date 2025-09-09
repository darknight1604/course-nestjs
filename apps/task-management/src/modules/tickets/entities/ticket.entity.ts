import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'int' })
  createdById: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @Column({ type: 'int', nullable: true })
  assigneeId: number;

  @Column({ type: 'varchar', nullable: true })
  status?: string;

  @Column({ type: 'int', nullable: true })
  parentId: number;

  @Column({ type: 'int', nullable: true })
  teamId: number;

  @Column({ type: 'int', nullable: true })
  sprintId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedDate: Date;
}
