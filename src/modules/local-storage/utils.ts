import { isServer } from '../env';

import Storage from './storage';

export const storage = isServer ? null : new Storage(window.localStorage, 'WIDGET-');

export const saveToStorageWithExpiry = <T = unknown>(
  key: string,
  value: T,
  expiry: number,
): void => {
  if (storage) {
    storage.setWithExpiry<T>(key, value, expiry);
  }
};

export const loadFromStorageWithExpiry = <T = unknown>(key: string): T | undefined => {
  if (storage) {
    return storage.getWithExpiry<T>(key);
  }
};

export const removeFromStorageWithExpiry = (key: string): void => {
  if (storage) {
    return storage.removeItem(key);
  }
};
