import { join } from 'path';
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

const configFileName = {
  development: 'dev',
  production: 'prod',
};

const env = process.env.NODE_ENV;

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, `./${configFileName[env]}.yaml`), 'utf8'),
  ) as Record<string, any>;
};
