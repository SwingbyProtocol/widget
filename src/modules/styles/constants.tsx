import { rem } from 'polished';

const website = `(min-height: ${rem(600)})`;

export const StylingConstants = {
  widgetBannerPadding: 14,
  widgetVerticalPadding: 40,
  mediaWideWidth: `(min-width: ${rem(600)})`,
  mediaVerticalWideWidth: `(min-width: ${rem(400)})`,
  mediaWebsiteWideWidth: `${website} and (min-width: ${rem(500)})`,
  mediaLayout: {
    widgetSmall: `(min-height: ${rem(375)})`,
    widgetFull: `(min-height: ${rem(510)})`,
    website,
  },
};
