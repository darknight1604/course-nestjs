import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  createdById: number;

  @Column()
  createdBy: string;

  @Column()
  createdDate: Date;

  @Column({ nullable: true })
  updatedDate: Date;
}
