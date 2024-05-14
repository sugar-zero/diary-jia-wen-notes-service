import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MenuMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, comment: '图标' })
  icon: string;

  @Column({ type: 'varchar', length: 20, comment: '标题' })
  title: string;

  @Column({ type: 'boolean', default: false, comment: '固定标签' })
  affix: boolean;

  @Column({ type: 'json', nullable: true, comment: '权限' })
  permissions: string[];

  @Column({ type: 'int', nullable: true, comment: '排序' })
  sort: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: '隐藏菜单',
  })
  hidden: boolean;
}
