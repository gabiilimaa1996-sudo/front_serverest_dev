describe('Login', () => {
  let validUser;
  let invalidUser;

  before(() => {
    cy.fixture('users').then((users) => {
      validUser = users.validUser;
      invalidUser = users.invalidUser;
    });
  });

  beforeEach(() => {
    cy.visit('/login');
  });

  it('logs in successfully with valid credentials', () => { ... });
  it('shows an error message with wrong credentials', () => { ... });
  it('shows an error message when password is blank', () => { ... });
  it('allows login using the reusable command', () => { ... });
});