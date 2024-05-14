import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './admin-user.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class UserRole {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roleId: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
