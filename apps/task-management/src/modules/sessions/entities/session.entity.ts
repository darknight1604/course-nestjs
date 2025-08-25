import { User } from '@task-management/modules/users/entities/user.entity';
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => User, (user) => user)
  userId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column()
  revoked: boolean;

  @Column()
  createdDate: Date;

  @Column({ nullable: true })
  updatedDate: Date;

  @Column()
  expiredAt: Date;
}
