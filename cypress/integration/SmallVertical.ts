(() => {
  const testCases = ({ width, height, name }: { width: number; height: number; name: string }) => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it('renders correctly', () => {
      cy.visit('/');
      cy.percySnapshot(`${name}: after loading`, { widths: [width], minHeight: height });
    });

    it('can switch coins', () => {
      cy.clock();
      cy.get('[data-testid="vertical.step-amounts.amounts.currency-from-select.target"]').click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.step-amounts.amounts.currency-from-select.content.item-BTCB"]')
        .should('be.visible')
        .click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.step-amounts.amounts.currency-to-select.target"]').click();
      cy.tick(10000);

      cy.percySnapshot(`${name}: switch coin`, { widths: [width], minHeight: height });

      cy.get(
        '[data-testid="vertical.step-amounts.amounts.currency-to-select.content.item-BTC"]',
      ).click();
      cy.tick(10000);
    });

    it('can input amounts', () => {
      cy.get('[data-testid="vertical.step-amounts.next-btn"]').should('be.disabled');

      cy.get('[data-testid="vertical.step-amounts.amounts.amount-from"]').type('1');

      cy.get('[data-testid="vertical.step-amounts.next-btn"]').should('not.be.disabled').click();
    });

    it('can input address', () => {
      cy.get('[data-testid="vertical.step-address.top.back-btn"]').should('be.visible').click();
      cy.get('[data-testid="vertical.step-amounts.next-btn"]').click();

      cy.get('[data-testid="vertical.step-address.swap-btn"]').should('be.disabled');

      cy.get('[data-testid="vertical.step-address.receiving-address"]').type(
        'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
      );

      cy.get('[data-testid="vertical.step-address.swap-btn"]').should('not.be.disabled').click();
    });

    it('renders last step', () => {
      cy.get('[data-testid="vertical.step-submitted.top.send-label"]').should('be.visible');
      cy.percySnapshot(`${name}: submitted`, { widths: [width], minHeight: height });
    });
  };

  describe('Small vertical', () => {
    testCases({ width: 445, height: 375, name: 'Small vertical' });
  });
})();
