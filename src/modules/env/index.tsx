export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'trace');

export enum LocalStorage {
  AffiliateCode = 'affiliateCode',
  AffiliateCodeSavedAt = 'affiliateCodeSavedAt',
}

export const blocknativeApiKey =
  process.env.NEXT_PUBLIC_BLOCKNATIVE_KEY || '9ed4d1ba-367b-48e6-b9bc-77e00782e4ba';

// Todo: Add mode toggle logic
export const ETHER_NETWORK =
  process.env.NEXT_PUBLIC_MODE === 'production'
    ? { id: 1, network: 'mainnet' }
    : { id: 1, network: 'mainnet' };

export const infuraApiKey =
  process.env.NEXT_PUBLIC_INFURA_KEY || 'f35c2a4f3d0941a38a3edb62ed10c847';

export const RPC_URL = `https://${ETHER_NETWORK.network}.infura.io/v3/${infuraApiKey}`;

export const infuraAppName = 'Swingby Widget';
