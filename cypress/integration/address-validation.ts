describe('Address validation', () => {
  const width = 600;
  const height = 600;

  beforeEach(() => {
    cy.viewport(width, height);
  });

  it('fills currency and amount data', () => {
    cy.visit('/swap/new');
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-from-select.content.item-BTCB"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-BTC"]').click();
    cy.get('[data-testid="vertical.form.amounts.amount-from"]').type('1');
  });

  it('validates addresses', () => {
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}invalidaddress',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}bnb1a4fqkg7pth85qnzvnapjf9zuhtxdn0yqjuuml9',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}0x38a3234377f7d3c749c8d7d02c9962eaa6800541',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');

    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').type(
      '{selectall}mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('not.be.disabled');
  });

  it('invalidates form if "currencyOut" changes', () => {
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').click();
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.content.item-BTCE"]').click();
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');
  });
});
