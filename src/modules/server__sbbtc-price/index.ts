import { CONTRACTS, SkybridgeBridge, SkybridgeMode } from '@swingby-protocol/sdk';
import { ethers } from 'ethers';

import { buildWeb3Instance } from '../server__web3';

export const calculateSbbtcPrice = async ({
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
}): Promise<string> => {
  const web3 = buildWeb3Instance({ mode, bridge });
  const contract = new web3.eth.Contract(
    CONTRACTS.bridges[bridge][mode].abi,
    CONTRACTS.bridges[bridge][mode].address,
  );
  const price = contract.methods.getCurrentPriceLP().call();
  return ethers.utils.parseUnits(price, 8).toString();
};
