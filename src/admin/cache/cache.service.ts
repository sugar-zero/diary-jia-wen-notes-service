import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { SystemService } from 'src/system/system.service';
import { ExemptionInterfaceService } from 'src/admin/exemption-interface/exemption-interface.service';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CacheService implements OnModuleInit {
  constructor(
    private systemService: SystemService,
    private exemptionInterfaceService: ExemptionInterfaceService,
  ) {}
  private readonly logger = new Logger('CacheService');
  // 缓存路径放到根目录
  private readonly cachePath = path.resolve(__dirname, '../../cache.json');

  /**
   * 在模块初始化时执行的操作
   *
   * @returns {Promise<void>} Promise对象，表示操作异步执行完成
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('等待系统建立初始化缓存...');
    await this.refreshCache();
    this.logger.log('系统缓存初始化建立完成');
  }

  private readonly cacheRefreshHandlers = {
    system: async () => {
      // 获取系统信息并返回data属性
      return (await this.systemService.GetInfo()).data;
    },

    exemptionInterface: async () => {
      return await this.exemptionInterfaceService.exemptionAuthentication();
    },

    inspectionGallery: async () => {
      return await this.exemptionInterfaceService.inspectionGallery();
    },
  };

  // 模拟缓存时间
  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 刷新缓存
   * @param type 缓存类型，可选参数，可以是字符串或字符串数组
   * @returns 返回一个Promise
   */
  async refreshCache(type?: string | Array<string>): Promise<any> {
    let cache: any = {};
    const errors = [];

    // 如果缓存路径存在
    if (fs.existsSync(this.cachePath)) {
      // 读取缓存文件内容
      const data = fs.readFileSync(this.cachePath, 'utf8');
      // 解析缓存文件内容为对象并赋值给缓存变量
      try {
        cache = JSON.parse(data);
      } catch (e) {
        cache = {};
      }
    }
    // 如果未提供type参数，或提供的是空数组，则刷新所有类型的缓存
    let typesToRefresh: string[];
    if (type === undefined || (Array.isArray(type) && type.length === 0)) {
      typesToRefresh = Object.keys(this.cacheRefreshHandlers);
    } else {
      // 确保type是一个字符串数组
      typesToRefresh = Array.isArray(type) ? type : [type];
    }

    // 遍历所需刷新的缓存类型
    for (const typeKey of typesToRefresh) {
      const handler = this.cacheRefreshHandlers[typeKey];
      if (handler) {
        try {
          cache[typeKey] = await handler();
          // await this.sleep(10000);
        } catch (e) {
          errors.push(`执行缓存类型 ${typeKey} 时发生错误：${e.message}`);
        }
      } else {
        // 如果typeKey不是有效的缓存类型，抛出错误
        // throw new UnauthorizedException(`无效的缓存类型：${typeKey}`);
        errors.push(typeKey);
      }
    }

    // 定义一个函数来判断对象是否为空
    const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0;
    // 检查执行完毕后缓存是否为空，如果为空则刷新所有缓存。这是防止提供的类型全部都是错误的，而缓存文件因为无发解析被置空的问题
    if (isObjectEmpty(cache)) {
      this.logger.error(
        '提供的缓存类型全部无效或执行出错且缓存文件被置空，正在刷新所有缓存...',
      );
      for (const typeKey of Object.keys(this.cacheRefreshHandlers)) {
        try {
          cache[typeKey] = await this.cacheRefreshHandlers[typeKey]();
        } catch (e) {
          // 如果在全缓存刷新时也出现错误，记录错误
          errors.push(
            `全缓存刷新时，执行缓存类型 ${typeKey} 时发生错误：${e.message}`,
          );
        }
      }
    }

    fs.writeFileSync(this.cachePath, JSON.stringify(cache));

    if (errors.length > 0) {
      throw new UnauthorizedException(
        `缓存执行完毕，但存在无效的缓存类型（跳过）：${errors}`,
      );
    }
  }

  /**
   * 获取缓存数据
   * @param type 缓存类型，可选参数，可以是字符串或字符串数组
   * @returns 返回对应类型的缓存数据，如果type参数为空则返回空对象，如果查询的是有效类型，则返回对应的缓存数据，否则返回空对象
   */
  async getCache(type?: string | Array<string>): Promise<any> {
    // 检查缓存文件是否存在
    if (fs.existsSync(this.cachePath)) {
      // 读取缓存文件内容
      const data = fs.readFileSync(this.cachePath, 'utf-8');
      let cache: any = {};
      try {
        cache = JSON.parse(data);
      } catch {
        cache = {};
      }

      // 只有提供这个特定的值才返回全部缓存
      if (type === 'all-by-all') {
        return cache;
      }

      // 确保type是一个字符串数组
      const types = Array.isArray(type) ? type : [type];

      // 如果数组为空，返回空
      if (types.length === 0) {
        return {};
      }

      const filteredCache = {};
      types.forEach((t) => {
        if (cache.hasOwnProperty(t)) {
          filteredCache[t] = cache[t];
        }
      });

      // 如果只请求了一个类型，直接返回该类型的值
      if (types.length === 1) {
        return filteredCache[types[0]];
      }
      return filteredCache;
    }

    // 如果缓存文件不存在，返回空
    return null;
  }

  /**
   * 每小时执行的定时任务方法，用于刷新缓存。
   */
  @Cron(CronExpression.EVERY_HOUR, { name: 'refreshCacheJob' })
  async handleCron() {
    this.logger.log('系统正在执行定时刷新缓存');
    await this.refreshCache();
    this.logger.log('缓存刷新完毕');
  }
}
