import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SystemConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'boolean',
    comment: '是否开启注册',
  })
  allowResgister: boolean;
}
