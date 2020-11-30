/* global cy */

import './commands';

beforeEach(() => {
  cy.server();
  cy.route('**/fees', 'fixture:fees.json');
  cy.route('POST', '**/swaps/create', 'fixture:create-swap.json');
  cy.route('**/api/v2', 'fixture:indexer.json');
  cy.route('**/swaps/query?hash=fake-hash-waiting', 'fixture:fake-swap-waiting.json');
  cy.route('**/swaps/query?hash=fake-hash-sending', 'fixture:fake-swap-sending.json');
  cy.route(
    '**/swaps/query?hash=fake-hash-sending-with-txout',
    'fixture:fake-swap-sending-with-txout.json',
  );
  cy.route('**/swaps/query?hash=fake-hash-completed', 'fixture:fake-swap-completed.json');
});
