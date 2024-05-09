import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MenuMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'boolean', default: false })
  affix: boolean;

  @Column({ type: 'json', nullable: true })
  permissions: string[];
}
