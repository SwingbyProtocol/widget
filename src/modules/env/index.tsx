import { IEtherNetwork, mode } from '../web3';

export const logLevel =
  process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'trace');

export enum LocalStorage {
  AffiliateCode = 'affiliateCode',
  AffiliateCodeSavedAt = 'affiliateCodeSavedAt',
}

export const blocknativeApiKey =
  process.env.NEXT_PUBLIC_BLOCKNATIVE_KEY || '9ed4d1ba-367b-48e6-b9bc-77e00782e4ba';

export const infuraApiKey =
  process.env.NEXT_PUBLIC_INFURA_KEY || 'f35c2a4f3d0941a38a3edb62ed10c847';

export const getEtherNetwork = (mode: mode): IEtherNetwork => {
  return mode === 'production' ? { id: 1, network: 'mainnet' } : { id: 5, network: 'goerli' };
};

export const getRpcUrl = (etherNetwork: IEtherNetwork) =>
  `https://${etherNetwork.network}.infura.io/v3/${infuraApiKey}`;

export const appName = 'Swingby Widget';
