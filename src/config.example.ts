import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

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
  endpoint: 'endpoint',
  bucket: 'bucket',
  region: 'region',
};
