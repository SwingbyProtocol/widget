const swapNodeEndpointList =
  process.env.NEXT_PUBLIC_SWAP_NODE_ENDPOINT_LIST ||
  new Array(25)
    .fill(null)
    .map((_, index) => {
      if (index === 0) return 'https://testnet-node.swingby.network/api';
      return `https://testnet-node-${index + 1}.swingby.network/api`;
    })
    .join(',');

export const swapNodeEndpoints = swapNodeEndpointList.split(',');

export const indexerBitcoinEndpoint =
  process.env.NEXT_PUBLIC_INDEXER_BITCOIN_ENDPOINT || 'https://indexer-tbtc.swingby.network/api';
export const indexerEthereumEndpoint =
  process.env.NEXT_PUBLIC_INDEXER_ETHEREUM_ENDPOINT || 'https://indexer-goerli.swingby.network/api';
