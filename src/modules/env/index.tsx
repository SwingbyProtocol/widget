export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'trace');

export enum LocalStorage {
  AffiliateCode = 'affiliateCode',
  AffiliateCodeSavedAt = 'affiliateCodeSavedAt',
  Terms = 'swingby-widget.terms',
}

export const blocknativeApiKey = process.env.NEXT_PUBLIC_BLOCKNATIVE_KEY;

export const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_KEY;

export const walletConnectBridge = process.env.NEXT_PUBLIC_WALLET_CONNECT_BRIDGE;
