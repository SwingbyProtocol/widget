/* global cy */

import './commands';

beforeEach(() => {
  cy.intercept({ pathname: /\/status$/ }, { statusCode: 500 }).as('ping');
  cy.intercept({ pathname: /\/network$/ }, { fixture: 'network.json' }).as('network');
  cy.intercept({ pathname: /\/fees$/ }, { fixture: 'fees.json' }).as('fees');
  cy.intercept({ pathname: /\/swaps\/create$/ }, { fixture: 'create-swap.json' }).as('create-swap');
  cy.intercept({ pathname: /\/api\/v2$/ }, { fixture: 'indexer.json' }).as('indexer');
  cy.intercept({ pathname: /\/floats\/balances$/ }, { fixture: 'float-balances.json' }).as(
    'floats-balance',
  );
  cy.intercept(
    { pathname: /\/graphql$/ },
    (req) => {
      const { id } = req.body.variables;
      req.reply({
        data: {
          transaction: {
            at: '2020-11-25T14:43:10.000Z',
            depositAddress: 'mzJ9Gi7vvp1NGw4fviWjkZaJxWakk5zfHt',
            depositAmount: '0.99999854',
            depositCurrency: 'BTC',
            depositTxHash: [
              'fake-hash-completed',
              'fake-hash-refunded',
              'fake-hash-sending-refund',
              'fake-hash-sending-with-txout',
              'fake-hash-sending',
            ].includes(id)
              ? '298380c8f74ec2a7a2ff2b9a76fb46958338957ec53fabcba61aa59f7a840e93'
              : null,
            feeCurrency: 'WBTC__ERC20',
            feeTotal: '0.0000001',
            id,
            receivingAddress: '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
            receivingAmount: '0.99999612',
            receivingCurrency: 'WBTC__ERC20',
            receivingTxHash: ['fake-hash-sending-refund', 'fake-hash-refunded'].includes(id)
              ? '298380c8f74ec2a7a2ff2b9a76fb46958338957ec53fabcba61aa59f7a840e93'
              : ['fake-hash-sending-with-txout', 'fake-hash-completed'].includes(id)
              ? '0x0e0c172a755bff9ea74e2404b271d4841082dc5fd10b41c83a6811c39e828f6e'
              : null,
            sendingAddress: 'tb1qkyamrxnwv6cqj9s9nnm244s455sflatpnttk4n',
            status:
              id === 'fake-hash-waiting'
                ? 'WAITING'
                : id === 'fake-hash-pending'
                ? 'PENDING'
                : id === 'fake-hash-signing'
                ? 'SIGNING'
                : id === 'fake-hash-signing-refund'
                ? 'SIGNING_REFUND'
                : id === 'fake-hash-sending'
                ? 'SENDING'
                : id === 'fake-hash-sending-refund'
                ? 'SENDING_REFUND'
                : id === 'fake-hash-sending-with-txout'
                ? 'SENDING'
                : id === 'fake-hash-completed'
                ? 'COMPLETED'
                : id === 'fake-hash-refunded'
                ? 'REFUNDED'
                : id === 'fake-hash-expired'
                ? 'EXPIRED'
                : '__INVALID__',
            type: 'SWAP',
          },
        },
      });
    },
    { fixture: 'fake-swap-waiting.json' },
  ).as('fake-hash-waiting');
  cy.intercept(
    { pathname: /\/api\/(mode|production)\/[^/]+\/status$/ },
    { fixture: 'maintenance-mode.json' },
  ).as('maintenance-mode');
});
