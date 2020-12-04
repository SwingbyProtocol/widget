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
    cy.get(`[data-testid="${testId}.swap-details.send-label"]`).should('be.visible');
    cy.percySnapshot(`${name}: waiting`, { widths: [width], minHeight: height });
  });

  it('renders "PENDING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-pending');
    cy.get(`[data-testid="${testId}.swap-details.sending-label"]`).should('be.visible');
    cy.percySnapshot(`${name}: pending`, { widths: [width], minHeight: height });
  });

  it('renders "SIGNING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-signing');
    cy.get(`[data-testid="${testId}.swap-details.sending-label"]`).should('be.visible');
    cy.percySnapshot(`${name}: signing`, { widths: [width], minHeight: height });
  });

  it('renders "SIGNING_REFUND" status correctly', () => {
    cy.visit('/test/swap/fake-hash-signing-refund');
    cy.get(`[data-testid="${testId}.swap-details.sending-label"]`).should('be.visible');
    cy.percySnapshot(`${name}: signing refund`, { widths: [width], minHeight: height });
  });

  it('renders "SENDING" status correctly', () => {
    cy.visit('/test/swap/fake-hash-sending');
    cy.get(`[data-testid="${testId}.swap-details.sending-label"]`).should('be.visible');
    cy.percySnapshot(`${name}: sending`, { widths: [width], minHeight: height });
  });

  it('renders "SENDING_REFUND" status correctly', () => {
    cy.visit('/test/swap/fake-hash-sending-refund');
    cy.get(`[data-testid="${testId}.swap-details.sending-label"]`).should('be.visible');
    cy.percySnapshot(`${name}: sending refund`, { widths: [width], minHeight: height });
  });

  it('renders "SENDING" status with an explorer link correctly', () => {
    cy.visit('/test/swap/fake-hash-sending-with-txout');
    cy.get(`[data-testid="${testId}.swap-details.explorer-link"]`).should('be.visible');
    cy.percySnapshot(`${name}: sending, with explorer link`, {
      widths: [width],
      minHeight: height,
    });
  });

  it('renders "COMPLETED" status correctly', () => {
    cy.visit('/test/swap/fake-hash-completed');
    cy.get(`[data-testid="${testId}.swap-details.explorer-link"]`).should('be.visible');
    cy.percySnapshot(`${name}: completed`, { widths: [width], minHeight: height });
  });

  it('renders "REFUNDED" status correctly', () => {
    cy.visit('/test/swap/fake-hash-refunded');
    cy.get(`[data-testid="${testId}.swap-details.explorer-link"]`).should('be.visible');
    cy.percySnapshot(`${name}: refunded`, { widths: [width], minHeight: height });
  });

  it('renders "EXPIRED" status correctly', () => {
    cy.visit('/test/swap/fake-hash-expired');
    cy.get(`[data-testid="${testId}.swap-details.completed-label"]`).should('be.visible');
    cy.get(`[data-testid="${testId}.swap-details.explorer-link"]`).should('not.exist');
    cy.percySnapshot(`${name}: expired`, { widths: [width], minHeight: height });
  });
};
