/* eslint-disable import/no-internal-modules */

import zh from './files/zh.json';
import zh_TW from './files/zh-TW.json';
import en from './files/en.json';
export { default as en } from './files/en.json';

const languages = {
  en,
  zh,
  'zh-TW': zh_TW,
};
