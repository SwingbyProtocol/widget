(() => {
  const testCases = ({ width, height, name }: { width: number; height: number; name: string }) => {
    beforeEach(() => {
      cy.viewport(width, height);
    });

    it('renders correctly', () => {
      cy.visit('/');
      cy.percySnapshot(`${name}: after loading`, { widths: [width] });
    });
  };

  describe('Full vertical', () => {
    testCases({ width: 445, height: 510, name: 'Full vertical' });
  });

  describe('Website', () => {
    testCases({ width: 600, height: 600, name: 'Website' });
  });
})();
