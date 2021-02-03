export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'trace');

export enum LocalStorage {
  AffiliateCode = 'affiliateCode',
  AffiliateCodeSavedAt = 'affiliateCodeSavedAt',
}
