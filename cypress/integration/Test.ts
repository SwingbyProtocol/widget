describe('Test', () => {
  it('rends correctly', () => {
    cy.visit('/');
    cy.percySnapshot('Test snapshot');
  });
});
