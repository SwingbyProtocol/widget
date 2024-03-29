describe('Address validation', () => {
  const width = 600;
  const height = 600;

  beforeEach(() => {
    cy.viewport(width, height);
  });

  it('fills currency and amount data', () => {
    cy.visit('/test/swap/new');
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-BTC"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
    cy.get(
      '[data-testid="vertical.form.amounts.currency-to-select.content.item-WBTC.SKYPOOL"]',
    ).click();
    cy.get('[data-testid="vertical.form.amounts.amount-from"]').type('1');
  });

  it('validates addresses', () => {
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}invalidaddress',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}bnb1a4fqkg7pth85qnzvnapjf9zuhtxdn0yqjuuml9',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('not.be.disabled');
  });

  it('invalidates form if "currencyReceiving" changes', () => {
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-WBTC"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-BTC"]').click();
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-BTC"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-WBTC"]').click();
    cy.get('[data-testid="vertical.form.swap-btn"]').should('not.be.disabled');
  });
});
