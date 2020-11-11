describe('Small vertical', () => {
  it('render correctly', () => {
    cy.viewport(445, 375);
    cy.visit('/');
    cy.percySnapshot('Small vertical', { widths: [445] });
  });
});
