import { join } from 'path';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

const configFileName = {
  development: 'dev',
  production: 'prod',
};

const env = process.env.NODE_ENV;

// 如果没有指定NODE_ENV环境默认为生产环境
env || (process.env.NODE_ENV = 'production');

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, `./${configFileName[env]}.yaml`), 'utf8'),
  ) as Record<string, any>;
};
