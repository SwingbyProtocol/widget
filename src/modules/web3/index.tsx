import { CONTRACTS } from '@swingby-protocol/sdk';
import Web3 from 'web3';

import { initOnboard, initNotify } from '../onboard';

export type mode = 'test' | 'production';
export type ethereumToken = 'WBTC' | 'sbBTC';
export interface IWeb3Arg {
  wallet: any;
  depositToken: ethereumToken;
  mode: mode;
  setContract: (arg: any) => void;
}

export interface IInitOnboardArg {
  subscriptions: any;
  mode: mode;
}

export interface IGetOnboardArg {
  setAddress: (address: string) => void;
  depositToken: ethereumToken;
  mode: mode;
  setContract: (arg: any) => void;
  setOnboard: (arg: any) => void;
  setNotify: (arg: any) => void;
}

export interface ITransferArg {
  amountDeposit: string;
  addressDeposit: string | undefined;
  address: string;
  contract: any;
  notify: any;
}

export interface IEtherNetwork {
  id: number;
  network: string;
}

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
  const smartContract = new web3.eth.Contract(TRANSFER_ABI, contract, wallet.provider);
  setContract(smartContract);
};

export const getOnboard = (data: IGetOnboardArg) => {
  const { setAddress, depositToken, mode, setContract, setOnboard, setNotify } = data;
  const onboardData = initOnboard({
    mode,
    subscriptions: {
      address: (walletAddress: string) => {
        updateWalletAddress(walletAddress, setAddress);
      },
      wallet: (wallet: any) => {
        if (wallet.provider) {
          const provider = wallet.provider;
          provider && initWeb3({ wallet, depositToken, mode, setContract });
        }
      },
    },
  });
  setOnboard(onboardData);
  setNotify(initNotify(mode));
};

export const updateWalletAddress = (address: string, setAddress: (arg: string) => void): void => {
  const formattedAddress = address ? address.toLowerCase() : address;
  setAddress(formattedAddress);
};

export const login = async (onboard: any) => {
  await onboard.walletSelect();
  await onboard.walletCheck();
};

export const ellipseAddress = (address: string, width: number = 5): string => {
  return address && `${address.slice(0, width)}...${address.slice(-width)}`;
};

export const getHexValue = (num: string): string => {
  const numberOfTokens = 8;
  const calculatedValue = Number(num) * Math.pow(10, numberOfTokens);
  const numAsHex = '0x' + calculatedValue.toString(16);
  return numAsHex;
};

export const transferERC20 = async (data: ITransferArg) => {
  const { amountDeposit, addressDeposit, contract, address, notify } = data;
  const fromAddress = address;
  const numberOfTokens = getHexValue(amountDeposit);
  await contract.methods
    .transfer(addressDeposit, numberOfTokens)
    .send({
      from: fromAddress,
    })
    .on('transactionHash', (hash: string) => {
      notify.hash(hash);
    });
};
