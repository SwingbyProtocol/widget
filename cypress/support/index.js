/* global cy */

import './commands';

beforeEach(() => {
  cy.server();
  cy.route('**/fees', 'fixture:fees.json');
  cy.route('POST', '**/swaps/create', 'fixture:create-swap.json');
  cy.route('**/api/v2', 'fixture:indexer.json');
  cy.route('**/swaps/query?hash=fake-hash-waiting', 'fixture:fake-swap-waiting.json');
  cy.route('**/swaps/query?hash=fake-hash-pending', 'fixture:fake-swap-pending.json');
  cy.route('**/swaps/query?hash=fake-hash-signing', 'fixture:fake-swap-signing.json');
  cy.route('**/swaps/query?hash=fake-hash-signing-refund', 'fixture:fake-swap-signing-refund.json');
  cy.route('**/swaps/query?hash=fake-hash-sending', 'fixture:fake-swap-sending.json');
  cy.route('**/swaps/query?hash=fake-hash-sending-refund', 'fixture:fake-swap-sending-refund.json');
  cy.route(
    '**/swaps/query?hash=fake-hash-sending-with-txout',
    'fixture:fake-swap-sending-with-txout.json',
  );
  cy.route('**/swaps/query?hash=fake-hash-completed', 'fixture:fake-swap-completed.json');
  cy.route('**/swaps/query?hash=fake-hash-refunded', 'fixture:fake-swap-refunded.json');
  cy.route('**/swaps/query?hash=fake-hash-expired', 'fixture:fake-swap-expired.json');
});
