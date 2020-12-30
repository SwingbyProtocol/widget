const NON_BREAKING_SPACE = '\u00A0';

describe('Query params', () => {
  const width = 600;
  const height = 600;

  beforeEach(() => {
    cy.viewport(width, height);
  });

  it('fills form correctly for swap with invalid defaults', () => {
    cy.visit(
      '/test/swap/new?defaultCurrencyDeposit=WBTC&defaultCurrencyReceiving=invalid&defaultAddressReceiving=0xaaaa&defaultAmountDesired=hey there',
    );

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}WBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}BTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.amount-from.native-input"]').should(
      'have.value',
      'hey there',
    );
    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').should(
      'have.value',
      '0xaaaa',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');
  });

  it('fills form correctly for swap with valid defaults', () => {
    cy.visit(
      '/test/swap/new?defaultCurrencyDeposit=BTC&defaultCurrencyReceiving=WBTC&defaultAddressReceiving=tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam&defaultAmountDesired=1',
    );

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}BTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}WBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.amount-from.native-input"]').should(
      'have.value',
      '1',
    );
    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').should(
      'have.value',
      'tbnb1k3cp6jl7z757hewt30nfvr97uywlxeap69glam',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('not.be.disabled');
  });

  it('fills forms correctly for pooling', () => {
    cy.visit(
      '/test/pool/new?defaultCurrencyDeposit=WBTC&defaultCurrencyReceiving=sbBTC&defaultAddressReceiving=0xaaaa&defaultAmountDesired=1',
    );

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}WBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}sbBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.amount-from.native-input"]').should(
      'have.value',
      '1',
    );
    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').should(
      'have.value',
      '0xaaaa',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');
  });

  it('fills forms correctly for withdrawals', () => {
    cy.visit(
      '/test/withdrawal/new?defaultCurrencyDeposit=sbBTC&defaultCurrencyReceiving=WBTC&defaultAddressReceiving=0xaaaa&defaultAmountDesired=1',
    );

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}sbBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}WBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.amount-from.native-input"]').should(
      'have.value',
      '1',
    );
    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').should(
      'have.value',
      '0xaaaa',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('be.disabled');
  });
});
