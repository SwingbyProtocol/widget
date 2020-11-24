import { rem } from 'polished';

export const StylingConstants = {
  widgetBannerPadding: 14,
  widgetVerticalPadding: 40,
  mediaWideWidth: `(min-width: ${rem(600)})`,
  mediaLayout: {
    widgetSmall: `(min-height: ${rem(375)})`,
    widgetFull: `(min-height: ${rem(510)})`,
    website: `(min-height: ${rem(600)})`,
  },
};
