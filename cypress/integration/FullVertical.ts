describe('Full vertical', () => {
  it('render correctly', () => {
    cy.viewport(445, 510);
    cy.visit('/');
    cy.percySnapshot('Full vertical', { widths: [445] });
  });
});
