describe('Narrow banner', () => {
  it('render correctly', () => {
    cy.viewport(320, 200);
    cy.visit('/');
    cy.percySnapshot('Narrow banner', { widths: [320] });
  });
});
