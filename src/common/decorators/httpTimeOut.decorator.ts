// timeout.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const TIMEOUT_KEY = 'customTimeout';
export const Timeout = (ms: number) => SetMetadata(TIMEOUT_KEY, ms);
