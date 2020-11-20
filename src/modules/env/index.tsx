import { Mode } from '@swingby-protocol/sdk';

export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'trace');

export const mode: Mode =
  process.env.NEXT_PUBLIC_SWINGBY_SDK_MODE === 'production' ? 'production' : 'test';
