import { CONTRACTS } from '@swingby-protocol/sdk';
import Web3 from 'web3';

export type mode = 'test' | 'production';
export type ethereumToken = 'WBTC' | 'sbBTC';
export interface IWeb3Arg {
  wallet: any;
  depositToken: ethereumToken;
  mode: mode;
  setContract: (arg: any) => void;
}

export const getHexValue = (num: string | number): string => {
  const calculatedValue = Number(num) * Math.pow(10, 8);
  const numAsHex = '0x' + calculatedValue.toString(16);
  return numAsHex;
};

export const TRANSFER_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    type: 'function',
  },
];

export const initWeb3 = (data: IWeb3Arg) => {
  const { wallet, depositToken, mode, setContract } = data;
  const web3: any = new Web3(wallet.provider);
  const contract = CONTRACTS[depositToken][mode].address;
  // const contract = CONTRACTS.WBTC;

  const smartContract = new web3.eth.Contract(TRANSFER_ABI, contract, wallet.provider);
  setContract(smartContract);
};

export const updateWalletAddress = (address: string, setAddress: (arg: string) => void): void => {
  const formattedAddress = address ? address.toLowerCase() : address;
  setAddress(formattedAddress);
};
