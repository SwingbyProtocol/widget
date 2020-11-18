(() => {
  const testCases = ({ width, height, name }: { width: number; height: number; name: string }) => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it('renders correctly', () => {
      cy.visit('/');
      cy.percySnapshot(`${name}: after loading`, { widths: [width] });
    });

    it('can switch coins', () => {
      cy.clock();
      cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-BTC.B"]')
        .should('be.visible')
        .click();
      cy.tick(10000);

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
      cy.tick(10000);

      cy.percySnapshot(`${name}: switch coin`, { widths: [width] });

      cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-BTC"]').click();
      cy.tick(10000);
    });
  };

  describe('Full vertical', () => {
    testCases({ width: 445, height: 510, name: 'Full vertical' });
  });

  describe('Website', () => {
    testCases({ width: 600, height: 600, name: 'Website' });
  });
})();
