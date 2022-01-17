import { CONTRACTS } from '@swingby-protocol/sdk';
import { StatusCodes } from 'http-status-codes';
import { ethers } from 'ethers';

import { createEndpoint, getStringParam } from '../../../../../modules/server__api-endpoint';
import { buildWeb3Instance } from '../../../../../modules/server__web3';

type Data = { balance: string };

export default createEndpoint<Data>({
  logId: 'sbbtc-balance',
  fn: async ({ req, res, mode, bridge }) => {
    const address = getStringParam({ req, name: 'address', from: 'query' });

    const web3 = buildWeb3Instance({ mode, bridge });
    const contract = new web3.eth.Contract(
      CONTRACTS.coins[bridge === 'btc_erc' ? 'sbBTC' : 'sbBTC.BEP20'][mode].abi,
      CONTRACTS.coins[bridge === 'btc_erc' ? 'sbBTC' : 'sbBTC.BEP20'][mode].address,
    );

    const amount = await contract.methods.balanceOf(address).call();
    const balance = ethers.utils.parseUnits(amount, 8).toString();

    res.status(StatusCodes.OK).json({
      balance,
    });
  },
});
