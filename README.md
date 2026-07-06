# Cypress E2E Tests — Serverest Front

Automated end-to-end tests for the [Serverest front-end app](https://front.serverest.dev/), built with Cypress in JavaScript.

## What this repo covers

This suite validates the core authentication and product search flows of the application:

- **Login** (`cypress/e2e/login.cy.js`) — valid login, invalid credentials, blank password validation, and login via the reusable custom command.
- **Product search** (`cypress/e2e/product-search.cy.js`) — logs in, searches for a product ("Logitech MX"), and verifies the expected result ("Logitech MX Vertical") appears.
- **Logout** (`cypress/e2e/logout.cy.js`) — logs in, confirms the home page loaded, logs out, and confirms the redirect back to the login page.

## Project structure

project-root/
├── cypress.config.js
└── cypress/
    ├── e2e/
    │   ├── login.cy.js
    │   ├── product-search.cy.js
    │   └── logout.cy.js
    ├── fixtures/
    │   └── users.json
    ├── support/
    │   └── commands.js
    └── README.md

## Reusable login command

All specs that require an authenticated session use the shared `cy.login()` custom command defined in `cypress/support/commands.js`. It performs the full login flow and verifies:

- The email and password fields are filled correctly.
- The submit button is enabled before clicking.
- The app redirects to `https://front.serverest.dev/home`.
- The `botaoPesquisar` search button is visible, confirming the page rendered.

```javascript
cy.login('testuser@example.com', 'password123');
```

This keeps every spec focused on its own scenario instead of repeating the login steps.

## Selectors used

| Element | Selector |
|---|---|
| Email field | `#email` |
| Password field | `#password` |
| Login submit button | `[data-testid="entrar"]` |
| Search input | `[placeholder="Pesquisar Produtos"]` |
| Search button | `[data-testid="botaoPesquisar"]` |
| Logout button | `[data-testid="logout"]` |
| Login error message | `form .alert.alert-secondary.alert-dismissible span` |

## Setup

Create a `cypress.config.js` at the project root with the `baseUrl` pointing to the app under test. This lets every spec use relative paths (`cy.visit('/login')`) instead of hardcoding full URLs:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://front.serverest.dev',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

With `baseUrl` set, `cy.visit('/login')` inside `commands.js` and the specs resolves automatically to `https://front.serverest.dev/login`.

## Running the tests

```bash
npm install cypress --save-dev
npx cypress open
```

Or headless:

```bash
npx cypress run
```

Make sure `baseUrl` is set to `https://front.serverest.dev` in `cypress.config.js`, or update the `cy.visit()` calls to use full URLs.

## Notes

- Error message assertions ("Email e/ou senha inválidos", "Password não pode ficar em branco") are tied to the app's real copy — update them if the UI text changes.
- URL assertions use exact match (`eq`) against the known app routes (`/home`, `/login`) for stronger verification than DOM-only checks.
