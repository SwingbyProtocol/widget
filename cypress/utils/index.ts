const NON_BREAKING_SPACE = '\u00A0';

export const testStatuses = ({
  testId,
  name,
  width,
  height,
}: {
  testId: 'vertical' | 'banner';
  name: string;
  width: number;
  height: number;
}) => {
  it('renders "WAITING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-waiting');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Send 0.99999854${NON_BREAKING_SPACE}BTC`
        : `Send 0.99999854${NON_BREAKING_SPACE}BTC to`,
    );
    cy.percySnapshot(`${name}: waiting`, { widths: [width], minHeight: height });
  });

  it('renders "PENDING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-pending');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Observed Waiting for confirmations…`
        : `Sending 0.99999612${NON_BREAKING_SPACE}WBTC to`,
    );
  });

  it('renders "SIGNING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-signing');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Sending 0.99999612${NON_BREAKING_SPACE}WBTC`
        : `Sending 0.99999612${NON_BREAKING_SPACE}WBTC to`,
    );
  });

  it('renders "SIGNING_REFUND" status correctly', () => {
    cy.visit('/test/swap/fake-hash-signing-refund');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Refunding 0.99999854${NON_BREAKING_SPACE}BTC`
        : `Refunding 0.99999854${NON_BREAKING_SPACE}BTC to`,
    );
    cy.percySnapshot(`${name}: signing refund`, { widths: [width], minHeight: height });
  });

  it('renders "SENDING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-sending');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Sending 0.99999612${NON_BREAKING_SPACE}WBTC`
        : `Sending 0.99999612${NON_BREAKING_SPACE}WBTC to`,
    );
  });

  it('renders "SENDING_REFUND" status correctly', () => {
    cy.visit('/test/swap/fake-hash-sending-refund');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Refunding 0.99999854${NON_BREAKING_SPACE}BTC`
        : `Refunding 0.99999854${NON_BREAKING_SPACE}BTC to`,
    );
  });

  it('renders "SENDING" status with an explorer link correctly', () => {
    cy.visit('/test/swap/fake-hash-sending-with-txout');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Sending 0.99999612${NON_BREAKING_SPACE}WBTC`
        : `Sending 0.99999612${NON_BREAKING_SPACE}WBTC to`,
    );
  });

  it('renders "COMPLETED" status correctly', () => {
    cy.visit('/test/swap/fake-hash-completed');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? `Sent 0.99999612${NON_BREAKING_SPACE}WBTC`
        : `${NON_BREAKING_SPACE}0.99999854${NON_BREAKING_SPACE}BTC${NON_BREAKING_SPACE}0.99999612${NON_BREAKING_SPACE}WBTC`,
    );
    cy.percySnapshot(`${name}: completed`, { widths: [width], minHeight: height });
  });

  it('renders "REFUNDED" status correctly', () => {
    cy.visit('/test/swap/fake-hash-refunded');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? 'Refunded 0.99999854 BTC'
        : `Refunded 0.99999854${NON_BREAKING_SPACE}BTC to`,
    );
  });

  it('renders "EXPIRED" status correctly', () => {
    cy.visit('/test/swap/fake-hash-expired');
    cy.get(`[data-testid="${testId}.swap-details.status-label"`).should(
      'have.text',
      testId === 'banner'
        ? 'This swap has expired'
        : `${NON_BREAKING_SPACE}0.99999854${NON_BREAKING_SPACE}BTC${NON_BREAKING_SPACE}0.99999612${NON_BREAKING_SPACE}WBTC`,
    );
    cy.get(`[data-testid="${testId}.swap-details.explorer-link"]`).should('not.exist');
    cy.percySnapshot(`${name}: expired`, { widths: [width], minHeight: height });
  });
};
