const selectors = {
  searchInput: '[placeholder="Pesquisar Produtos"]',
  searchButton: '[data-testid="botaoPesquisar"]',
};

const validUser = {
  email: 'testuser@example.com',
  password: 'password123',
};

describe('Product search', () => {
  beforeEach(() => {
    cy.login(validUser.email, validUser.password);
  });

  it('finds "Logitech MX Vertical" when searching for "Logitech MX"', () => {
    cy.get(selectors.searchInput).type('Logitech MX');
    cy.get(selectors.searchButton).click();

    cy.contains('Logitech MX Vertical').should('be.visible');
  });
});