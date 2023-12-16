import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * 异步函数，用于启动应用程序
 */
async function bootstrap() {
  // 创建一个NestFactory实例，并使用AppModule进行初始化
  const app = await NestFactory.create(AppModule);
  // 监听3000端口
  await app.listen(3000);
}
bootstrap();
