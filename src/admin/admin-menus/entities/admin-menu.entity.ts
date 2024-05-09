import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MenuMeta } from './menu-meta.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  path: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  component: string;

  @Column({ type: 'varchar', nullable: true })
  redirect: string;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
  parent: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @OneToOne(() => MenuMeta, { cascade: true, eager: true })
  @JoinColumn()
  meta: MenuMeta;
}
