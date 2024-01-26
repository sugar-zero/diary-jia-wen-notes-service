import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 这里存放的是一些你希望被排除的接口
// 例如你想免鉴权可以访问的接口或维护中仍然可以访问的接口
@Entity()
export class ExemptionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    comment: '路由接口',
  })
  routingInterface: string;

  @Column({
    type: 'boolean',
    nullable: false,
    comment: '免鉴权',
    default: false,
  })
  exemptionAuthentication: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
    comment: '维护可用',
    default: false,
  })
  inspectionGallery: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '类型',
  })
  method: string;
}
