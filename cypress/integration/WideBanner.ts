describe('Wide banner', () => {
  it('render correctly', () => {
    cy.viewport(650, 200);
    cy.visit('/');
    cy.percySnapshot('Wide banner', { widths: [650] });
  });
});
