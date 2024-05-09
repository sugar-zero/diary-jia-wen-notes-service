import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, IsNull } from 'typeorm';
import { Menu } from './entities/admin-menu.entity';

@Injectable()
export class AdminMenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}
  /**
   * @returns 菜单列表
   */
  async findMenus() {
    // 获取一级菜单
    const rootMenus = await this.menuRepository.find({
      where: { parent: IsNull() },
      relations: ['children', 'children.meta', 'meta'],
    });

    // 递归处理子菜单
    for (const menu of rootMenus) {
      menu.children = await this.getChildren(menu.id);
    }

    return rootMenus;
  }
  /**
   * 递归获取子菜单及Meta
   * @param parentId 父菜单ID
   * @returns 子菜单
   */
  private async getChildren(parentId: number): Promise<Menu[]> {
    const children = await this.menuRepository.find({
      where: { parent: Equal(parentId) },
      relations: ['children', 'children.meta', 'meta'],
    });
    for (const child of children) {
      child.children = await this.getChildren(child.id);
    }

    return children.length > 0 ? children : undefined; // 避免返回空数组
  }
}
