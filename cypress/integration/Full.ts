import { testStatuses } from '../utils';

(() => {
  const testCases = ({ width, height, name }: { width: number; height: number; name: string }) => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it('renders correctly', () => {
      cy.visit('/test/swap/new');
      cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
        'be.visible',
      );
      cy.percySnapshot(`${name}: after loading`, { widths: [width], minHeight: height });
    });

    it('can switch coins', () => {
      cy.clock();
      cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-BTCB"]')
        .should('be.visible')
        .click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
      cy.tick(10000);

      cy.percySnapshot(`${name}: switch coin`, { widths: [width], minHeight: height });

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-BTC"]').click();
      cy.tick(10000);
    });

    it('can input amounts', () => {
      cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

      cy.get('[data-testid="vertical.form.amounts.amount-from"]').type('1');

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

  describe('Full vertical', () => {
    testCases({ width: 445, height: 510, name: 'Full vertical' });
  });

  describe('Website', () => {
    testCases({ width: 600, height: 600, name: 'Website' });
  });
})();
