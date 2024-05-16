import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, IsNull } from 'typeorm';
import { Menu } from './entities/admin-menu.entity';
import { MenuMeta } from './entities/menu-meta.entity';
import { AdminUserService } from '../admin-user/admin-user.service';

export interface RootMenuMeta {
  name: string;
  path: string;
  meta: object;
  component: string;
  redirect: string | null;
  children?: RootMenuMeta[];
}

@Injectable()
export class AdminMenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(MenuMeta)
    private readonly menuMetaRepository: Repository<MenuMeta>,
    private readonly adminUserService: AdminUserService,
  ) {}
  /**
   * @returns 菜单列表
   */
  async findMenus(userid): Promise<RootMenuMeta[]> {
    const userPermissions = await this.adminUserService.GetUserAuth(userid);
    // 获取一级菜单
    const rootMenus = await this.menuRepository.find({
      where: { parent: IsNull() },
      relations: ['children', 'children.meta', 'meta'],
      order: {
        meta: {
          sort: 'ASC',
        },
      },
    });

    // 递归处理子菜单
    const rootMenusWithMeta = await Promise.all(
      rootMenus.map(async (menu) => {
        const menuWithMeta: RootMenuMeta = {
          name: menu.name,
          path: menu.path,
          meta: this.removeIdFromMeta(menu.meta),
          component: menu.component,
          redirect: menu.redirect,
          children: await this.getChildren(menu.id, userPermissions),
        };
        return menuWithMeta;
      }),
    );

    return rootMenusWithMeta;
  }
  /**
   * 递归获取子菜单及Meta
   * @param parentId 父菜单ID
   * @param userPermissions 用户权限组
   * @returns 子菜单
   */
  private async getChildren(
    parentId: number,
    userPermissions: string[],
  ): Promise<RootMenuMeta[]> {
    const children = await this.menuRepository.find({
      where: { parent: Equal(parentId) },
      relations: ['children', 'children.meta', 'meta'],
      order: {
        meta: {
          sort: 'ASC', // 使用 DESC 进行倒序排序
        },
      },
    });

    const childrenWithMeta = await Promise.all(
      children.map(async (child) => {
        const childWithMeta: RootMenuMeta = {
          name: child.name,
          path: child.path,
          meta: this.removeIdFromMeta(child.meta),
          component: child.component,
          redirect: child.redirect,
          children:
            child.children && child.children.length > 0
              ? await this.getChildren(child.id, userPermissions)
              : undefined,
        };
        // 检查权限并过滤
        if (child.meta.permissions && child.meta.permissions.length > 0) {
          const hasPermission = child.meta.permissions.some((permission) =>
            userPermissions.includes(permission),
          );
          return hasPermission ? childWithMeta : undefined;
        } else {
          return childWithMeta;
        }
      }),
    );

    return childrenWithMeta.filter((child) => child !== undefined);
  }
  /**
   * 去除 meta 对象中的 id 属性
   * @param meta 原始 meta 对象
   * @returns 去除 id 属性后的 meta 对象
   */
  private removeIdFromMeta(meta: any): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...metaWithoutId } = meta;
    return metaWithoutId;
  }

  /**
   * 菜单管理接口
   * @returns 菜单列表
   */
  async findMenuList(): Promise<any> {
    // 获取一级菜单
    const rootMenus = await this.menuRepository.find({
      where: { parent: IsNull() },
      relations: ['children', 'children.meta', 'meta'],
      order: {
        meta: {
          sort: 'ASC',
        },
      },
    });

    // 递归处理子菜单并格式化为新结构
    const formattedMenus = await this.formatMenus(rootMenus);

    return { list: formattedMenus };
  }
  /**
   * 递归格式化菜单结构为新需求格式
   * @param menus 要格式化的菜单列表
   * @returns 格式化后的菜单列表
   */
  private async formatMenus(menus: Menu[]): Promise<any[]> {
    return Promise.all(
      menus.map(async (menu) => {
        const formattedMenu: any = {
          id: menu.id,
          title: menu.name,
          redirect: menu.redirect,
          key: menu.name,
          meta: menu.meta,
          path: menu.path,
          children: menu.children && (await this.formatMenus(menu.children)),
        };

        // 如果有额外的meta信息需要处理，可以在这里添加逻辑
        // if (menu.meta) {
        //   Object.assign(formattedMenu, this.removeIdFromMeta(menu.meta));
        // }

        return formattedMenu;
      }),
    );
  }

  /**
   * 更新菜单
   */
  async updateMenu(menu): Promise<any> {
    if (menu.meta) {
      const metaData = menu.meta;
      this.menuMetaRepository.update(
        { id: metaData.id },
        {
          icon: !metaData.icon ? null : metaData.icon,
          affix: metaData.affix,
          permissions:
            Array.isArray(metaData.permissions) &&
            metaData.permissions.length > 0
              ? metaData.permissions
              : null,
          sort: metaData.sort,
          title: metaData.title,
          hidden: metaData.hidden,
        },
      );
    }

    await this.menuRepository.update(
      { id: menu.id },
      {
        name: menu.key,
        path: menu.path,
        redirect: menu.redirect,
      },
    );
    return {
      message: '更新成功',
    };
  }
}
