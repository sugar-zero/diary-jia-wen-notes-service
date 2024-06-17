import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (
  auths: string[],
  options?: { resultMode?: boolean; superMode?: boolean; authAny?: boolean },
) => SetMetadata(PERMISSIONS_KEY, { auths, ...options });
