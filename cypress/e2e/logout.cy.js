const selectors = {
  logoutButton: '[data-testid="logout"]',
};

const validUser = {
  email: 'testuser@example.com',
  password: 'password123',
};

describe('Logout', () => {
  beforeEach(() => {
    cy.login(validUser.email, validUser.password);
  });

  it('logs out and returns to the login page', () => {
    cy.url().should('eq', 'https://front.serverest.dev/home');

    cy.get(selectors.logoutButton).should('be.visible').click();

    cy.url().should('eq', `${Cypress.config('baseUrl')}/login`);
  });
});