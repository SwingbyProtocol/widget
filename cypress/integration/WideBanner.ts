describe('Wide banner', () => {
  beforeEach(() => {
    cy.viewport(650, 200);
  });

  it('render correctly', () => {
    cy.visit('/');
    cy.percySnapshot('Wide banner: after loading', { widths: [650] });
  });

  it('can switch coins', () => {
    cy.clock();
    cy.get('[data-testid="banner.step-amounts.amounts.currency-from-select"]').click();
    cy.tick(10000);

    cy.get(
      '[data-testid="banner.step-amounts.amounts.currency-from-select.coin-list.back-btn"]',
    ).should('be.visible');

    cy.percySnapshot('Wide banner: switch coin', { widths: [650] });

    cy.get(
      '[data-testid="banner.step-amounts.amounts.currency-from-select.coin-list.back-btn"]',
    ).click();
    cy.tick(10000);
    cy.get('[data-testid="banner.step-amounts.amounts.currency-from-select"]').click();
    cy.tick(10000);

    cy.get('[data-testid="banner.step-amounts.amounts.currency-from-select.coin-list.item-BTC.B"]')
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.tick(10000);

    cy.get('[data-testid="banner.step-amounts.amounts.currency-to-select"]').click();
    cy.tick(10000);
    cy.get(
      '[data-testid="banner.step-amounts.amounts.currency-to-select.coin-list.back-btn"]',
    ).click();
    cy.tick(10000);
    cy.get('[data-testid="banner.step-amounts.amounts.currency-to-select"]').click();
    cy.tick(10000);
    cy.get(
      '[data-testid="banner.step-amounts.amounts.currency-to-select.coin-list.item-BTC"]',
    ).click();
    cy.tick(10000);
  });

  it('can input amounts', () => {
    cy.get('[data-testid="banner.step-amounts.next-btn"]').should('be.disabled');

    cy.get('[data-testid="banner.step-amounts.amounts.amount-from"]').type('1');
    cy.get('[data-testid="banner.step-amounts.amounts.amount-to"]').type('1');

    cy.get('[data-testid="banner.step-amounts.next-btn"]').should('not.be.disabled').click();
  });

  it('can input address', () => {
    cy.get('[data-testid="banner.step-address.back-btn"]').should('be.visible').click();
    cy.get('[data-testid="banner.step-amounts.next-btn"]').should('not.be.disabled').click();

    cy.percySnapshot('Wide banner: address step', { widths: [650] });

    cy.get('[data-testid="banner.step-address.swap-btn"]').should('be.disabled');
    cy.get('[data-testid="banner.step-address.receiving-address.native-input"]').type(
      'mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
    );
    cy.get('[data-testid="banner.step-address.swap-btn"]').should('not.be.disabled').click();
  });

  it('renders last step', () => {
    cy.percySnapshot('Wide banner: submitted', { widths: [650] });
  });
});
