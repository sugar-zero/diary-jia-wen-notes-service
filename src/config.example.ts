import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';
/**
 * 以下内容请分别新建config.dev与config.prod文件，并将其内容复制过去；否则运行会报错，因为数据库使用env配置太麻烦了配置了好久
 * 没有生效，我就使用了取巧的方式，如果你有兴趣可以自己改成env形式配置；顺便吐槽一句，为什么nest的process.env做的这么烂，不能像
 * vue一样直接配置.env文件就能读取还要开发人员大费周章
 */
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'databse',
  charset: 'utf8mb4',
  timezone: '+08:00',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  debug: false,
};

export const jwtConfig: JwtModuleOptions = {
  secret: 'diary-service',
  signOptions: {
    expiresIn: '7d',
  },
  global: true,
};
//以下内容请新建config.oss.ts并剪切过去
export const prodOssConfig = {
  accessKeyId: 'accessKeyId',
  accessKeySecret: 'accessKeySecret',
  endpoint: 'endpoint', //url在概况能看到
  bucket: 'bucket', //是名字不是url
  region: 'region', //oss-cn-guangzhou，好像一定要这样写
};
