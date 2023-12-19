import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModuleOptions } from '@nestjs/jwt';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '192.168.2.15',
  port: 3306,
  username: 'diary-service',
  password: 'Drk3peDWctPzz5kS',
  database: 'diary-service-develop',
  charset: 'utf8mb4',
  timezone: '+08:00',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
};

export const jwtConfig: JwtModuleOptions = {
  secret: 'diary-service',
  signOptions: {
    expiresIn: '7d',
  },
  global: true,
};
