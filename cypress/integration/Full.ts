import { testStatuses } from '../utils';

(() => {
  const testCases = ({ width, height, name }: { width: number; height: number; name: string }) => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it('renders correctly', () => {
      cy.clock();
      cy.visit('/test/swap/new');
      cy.tick(10000);
      cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
        'be.visible',
      );
      cy.tick(10000);
      cy.get('#testnet').should('be.visible');
    });

    it('can switch coins', () => {
      cy.clock();
      cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-WBTC"]')
        .should('be.visible')
        .click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-BTC"]').click();
      cy.tick(10000);
    });

    it('can input amounts', () => {
      cy.clock();
      cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

      cy.get('[data-testid="vertical.form.amounts.amount-from"]').type('1');
      cy.wait('@fees');
      cy.get('[data-testid="banner.form.amounts.amount-to.loading"]').should('not.exist');

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
      cy.tick(10000);

      cy.percySnapshot(`${name}: with amount and dropdown`, { widths: [width], minHeight: height });

      cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');
    });

    it('can input address', () => {
      cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

      cy.get('[data-testid="vertical.form.receiving-address"]').type(
        'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
      );

      cy.get('[data-testid="vertical.form.swap-btn"]').should('not.be.disabled').click();
      cy.get('[data-testid="vertical.swap-details.status-label"]').should('be.visible');
    });

    testStatuses({ name, width, height, testId: 'vertical' });
  };

  describe('Full vertical (narrow)', () => {
    testCases({ width: 320, height: 510, name: 'Full vertical (narrow)' });
  });

  describe('Full vertical (wide)', () => {
    testCases({ width: 445, height: 510, name: 'Full vertical (wide)' });
  });

  describe('Website (narrow)', () => {
    testCases({ width: 320, height: 600, name: 'Website (narrow)' });
  });

  describe('Website (medium)', () => {
    testCases({ width: 400, height: 600, name: 'Website (medium)' });
  });

  describe('Website (wide)', () => {
    testCases({ width: 500, height: 600, name: 'Website (wide)' });
  });
})();
