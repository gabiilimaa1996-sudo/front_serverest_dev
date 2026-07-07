import './commands/auth.commands'
import './commands/users.commands'
import './commands/products.commands'
import './commands/carts.commands'

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(password, { log: false });
  cy.get('[data-testid="entrar"]').should('be.enabled').click();

  cy.url().should('eq', `${Cypress.config('baseUrl')}/home`);
  cy.get('[data-testid="botaoPesquisar"]').should('be.visible');
});