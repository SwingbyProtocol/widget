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
      `${NON_BREAKING_SPACE}WBTC (legacy)`,
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
      '/test/swap/new?defaultCurrencyDeposit=sbBTC&defaultCurrencyReceiving=WBTC&defaultAddressReceiving=0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc&defaultAmountDesired=1',
    );

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}sbBTC`,
    );
    cy.get('[data-testid="vertical.form.amounts.currency-to-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}WBTC (legacy)`,
    );
    cy.get('[data-testid="vertical.form.amounts.amount-from.native-input"]').should(
      'have.value',
      '1',
    );
    cy.get('[data-testid="vertical.form.receiving-address.native-input"]').should(
      'have.value',
      '0x3F4341a0599f63F444B6f1e0c7C5cAf81b5843Cc',
    );
    cy.get('[data-testid="vertical.form.swap-btn"]').should('not.be.disabled');
  });

  it('fills forms correctly for pooling', () => {
    cy.visit(
      '/test/pool/new?defaultCurrencyDeposit=WBTC&defaultCurrencyReceiving=BTCB&defaultAddressReceiving=0xaaaa&defaultAmountDesired=1',
    );

    cy.get('[data-testid="vertical.form.amounts.currency-from-select.target"]').should(
      'have.text',
      `${NON_BREAKING_SPACE}WBTC (legacy)`,
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
      `${NON_BREAKING_SPACE}WBTC (legacy)`,
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
