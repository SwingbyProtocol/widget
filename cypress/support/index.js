/* global cy */

import './commands';

beforeEach(() => {
  cy.server();
  cy.route('**/fees', 'fixture:fees.json');
});
