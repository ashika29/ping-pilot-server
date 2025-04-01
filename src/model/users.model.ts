import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Role } from './roles.model';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false, length: 50 })
  email: string;

  @Column({ nullable: false, length: 255 })
  password: string;

  @Column({ default: 0 })
  is_blocked: boolean;

  @OneToOne(() => Role, (role) => role.user)
  role: Role;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
