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

  @Column({ type: 'varchar', length: 100, comment: '菜单路径' })
  path: string;

  @Column({ type: 'varchar', length: 100, comment: '菜单名（唯一）' })
  name: string;

  @Column({ type: 'varchar', length: 100, comment: 'vue文件路径' })
  component: string;

  @Column({ type: 'varchar', nullable: true, comment: '重定向' })
  redirect: string;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
  parent: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @OneToOne(() => MenuMeta, { cascade: true, eager: true })
  @JoinColumn()
  meta: MenuMeta;
}
