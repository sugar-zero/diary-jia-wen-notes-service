import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// import { ResponseIntercept } from './common/responseIntercept';
import { AbnormalFilter } from './common/abnormalFilter';
import * as bodyParser from 'body-parser';

/**
 * 异步函数，用于启动应用程序
 */
async function bootstrap() {
  // 创建一个NestFactory实例，并使用AppModule进行初始化
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 启用版本号
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 静态资源目录
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/static',
  });
  //  全局拦截器
  // app.useGlobalInterceptors(new ResponseIntercept());
  // 全局异常过滤器
  app.useGlobalFilters(new AbnormalFilter());
  // 全局管道
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({ limit: '10mb' }));
  // 监听3000端口
  await app.listen(3000);
}
bootstrap();
