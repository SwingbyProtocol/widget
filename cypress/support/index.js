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
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-waiting' } },
    { fixture: 'fake-swap-waiting.json' },
  ).as('fake-hash-waiting');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-pending' } },
    { fixture: 'fake-swap-pending.json' },
  ).as('fake-hash-pending');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-signing' } },
    { fixture: 'fake-swap-signing.json' },
  ).as('fake-hash-signing');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-signing-refund' } },
    { fixture: 'fake-swap-signing-refund.json' },
  ).as('fake-hash-signing-refund');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-sending' } },
    { fixture: 'fake-swap-sending.json' },
  ).as('fake-hash-sending');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-sending-refund' } },
    { fixture: 'fake-swap-sending-refund.json' },
  ).as('fake-hash-sending-refund');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-sending-with-txout' } },
    { fixture: 'fake-swap-sending-with-txout.json' },
  ).as('fake-hash-sending-with-txout');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-completed' } },
    { fixture: 'fake-swap-completed.json' },
  ).as('fake-hash-completed');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-refunded' } },
    { fixture: 'fake-swap-refunded.json' },
  ).as('fake-hash-refunded');
  cy.intercept(
    { pathname: /\/swaps\/query$/, query: { hash: 'fake-hash-expired' } },
    { fixture: 'fake-swap-expired.json' },
  ).as('fake-hash-expired');
});
