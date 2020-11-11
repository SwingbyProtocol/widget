import { rem } from 'polished';

export const StylingConstants = {
  mediaWideWidth: `(min-width: ${rem(600)})`,
  mediaLayout: {
    widgetSmall: `(min-height: ${rem(375)})`,
    widgetFull: `(min-height: ${rem(510)})`,
    website: `(min-height: ${rem(600)})`,
  },
};
