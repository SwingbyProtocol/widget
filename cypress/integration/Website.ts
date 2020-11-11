describe('Website', () => {
  it('render correctly', () => {
    cy.viewport(600, 600);
    cy.visit('/');
    cy.percySnapshot('Website', { widths: [600] });
  });
});
