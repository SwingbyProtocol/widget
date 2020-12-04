import { testStatuses } from '../utils';

(() => {
  const testCases = ({ width, height, name }: { width: number; height: number; name: string }) => {
    beforeEach(() => {
      cy.viewport(width, 200);
    });

    it('renders correctly', () => {
      cy.visit('/test/swap/new');
      cy.percySnapshot(`${name}: after loading`, { widths: [width], minHeight: height });
    });

    it('can switch coins', () => {
      cy.clock();
      cy.get('[data-testid="banner.form.amounts.currency-from-select"]').click();
      cy.tick(10000);

      cy.get('[data-testid="banner.form.amounts.currency-from-select.coin-list.back-btn"]').should(
        'be.visible',
      );

      cy.percySnapshot(`${name}: switch coin`, { widths: [width], minHeight: height });

      cy.get('[data-testid="banner.form.amounts.currency-from-select.coin-list.back-btn"]').click();
      cy.tick(10000);
      cy.get('[data-testid="banner.form.amounts.currency-from-select"]').click();
      cy.tick(10000);

      cy.get('[data-testid="banner.form.amounts.currency-from-select.coin-list.item-BTCB"]')
        .scrollIntoView()
        .should('be.visible')
        .click();
      cy.tick(10000);

      cy.get('[data-testid="banner.form.amounts.currency-to-select"]').click();
      cy.tick(10000);
      cy.get('[data-testid="banner.form.amounts.currency-to-select.coin-list.back-btn"]').click();
      cy.tick(10000);
      cy.get('[data-testid="banner.form.amounts.currency-to-select"]').click();
      cy.tick(10000);
      cy.get('[data-testid="banner.form.amounts.currency-to-select.coin-list.item-BTC"]').click();
      cy.tick(10000);
    });

    it('can input amounts', () => {
      cy.get('[data-testid="banner.form.next-btn"]').should('be.disabled');

      cy.get('[data-testid="banner.form.amounts.amount-from"]').type('1');

      cy.get('[data-testid="banner.form.next-btn"]').should('not.be.disabled').click();
    });

    it('can input address', () => {
      cy.get('[data-testid="banner.form.back-btn"]').should('be.visible').click();
      cy.get('[data-testid="banner.form.next-btn"]').should('not.be.disabled').click();

      cy.percySnapshot(`${name}: address step`, { widths: [width], minHeight: height });

      cy.get('[data-testid="banner.form.swap-btn"]').should('be.disabled');
      cy.get('[data-testid="banner.form.receiving-address.native-input"]').type(
        'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
      );
      cy.get('[data-testid="banner.form.swap-btn"]').should('not.be.disabled').click();
      cy.get('[data-testid="banner.swap-details.send-label"]').should('be.visible');
    });

    testStatuses({ name, width, height, testId: 'banner' });
  };

  describe('Narrow banner', () => {
    testCases({ width: 320, height: 76, name: 'Narrow banner' });
  });

  describe('Wide banner', () => {
    testCases({ width: 650, height: 76, name: 'Wide banner' });
  });
})();
