/* global cy */

import './commands';

beforeEach(() => {
  cy.server();
  cy.route('**/fees', 'fixture:fees.json');
  cy.route('POST', '**/swaps/create', 'fixture:create-swap.json');
  cy.route('**/api/v2', 'fixture:indexer.json');
});
