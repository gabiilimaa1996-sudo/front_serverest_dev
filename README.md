# Cypress API Tests - ServeRest

API test automation project built with Cypress and JavaScript for the ServeRest API, organized by domain and supported by reusable custom commands.

## Project structure

```bash
cypress-project/
├─ cypress/
│  ├─ e2e/
│  │  ├─ auth/
│  │  │  └─ login.cy.js
│  │  ├─ products/
│  │  │  └─ create-product.cy.js
│  │  └─ carts/
│  │     └─ list-carts.cy.js
│  ├─ fixtures/
│  │  ├─ login.json
│  │  └─ products.json
│  └─ support/
│     ├─ commands/
│     │  ├─ auth.commands.js
│     │  ├─ users.commands.js
│     │  ├─ products.commands.js
│     │  └─ carts.commands.js
│     ├─ commands.js
│     └─ e2e.js
├─ cypress.config.js
├─ package.json
└─ README.md
```

This structure separates specs, fixtures, and support commands to improve maintainability, scalability, and reuse across authentication, product, and cart scenarios.

## Technologies

- Cypress
- JavaScript
- ServeRest API

Cypress supports API testing with `cy.request()`, as well as hooks, fixtures, and custom commands, which fits well with the organization used in this project.

## Configuration

The `cypress.config.js` file centralizes the API base URL and the spec location pattern, allowing the use of relative routes such as `/login`, `/produtos`, and `/carrinhos`.

Example:

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js'
  },
  video: false
})
```

## Fixtures

Fixtures store reusable static test data for positive and negative login and product scenarios, reducing duplication and making the tests easier to read.

### `cypress/fixtures/login.json`

Contains examples such as:

- `validUser`
- `invalidPasswordUser`
- `missingEmailUser`
- `missingPasswordUser`
- `emptyBody`

These data sets support the documented `POST /login` validations, including successful authentication and `401` responses for invalid or incomplete credentials.

### `cypress/fixtures/products.json`

Contains base product payloads used as a starting point for unique-name and duplicate-name scenarios in the `POST /produtos` endpoint.

## Support

The `cypress/support` folder contains custom commands and the global Cypress bootstrap layer.

### `e2e.js`

This file imports `./commands`, making all custom commands available to every spec.

```js
import './commands'
```

### `commands.js`

This file acts as an aggregator and imports the command modules by domain.

```js
import './commands/auth.commands'
import './commands/users.commands'
import './commands/products.commands'
import './commands/carts.commands'
```

## Custom commands

The commands are split by domain to improve organization and maintenance.

### `auth.commands.js`

Contains:

- `cy.loginApi()`
- `cy.createAuthenticatedAdminSession()`

These commands allow authentication with an existing user or the creation of a complete admin session for scenarios that require a valid token and administrator permission, such as product creation and cart creation.

### `users.commands.js`

Contains:

- `cy.createRandomUser()`

This command creates dynamic users with `administrador: 'true'` or `administrador: 'false'`, which helps avoid data collisions and enables authorization scenarios such as validating `403` for administrator-only routes.

### `products.commands.js`

Contains:

- `cy.createProduct()`

This command centralizes authenticated product creation for scenarios where `POST /produtos` should return `201` on success or `400` for duplicate product names.

### `carts.commands.js`

Contains:

- `cy.createCart()`

This command wraps `POST /carrinhos`, which binds the cart to the user from the `Authorization` token and allows only one cart per user.

## Implemented specs

### `auth/login.cy.js`

Validates the `POST /login` endpoint with the following scenarios:

- `200` with message `Login realizado com sucesso`
- `authorization` field returned
- JWT format with three parts
- token lifetime equal to 600 seconds
- `401` for invalid password
- `401` for missing email
- `401` for missing password
- `401` for empty body

The spec uses a dynamically created user before the suite runs to avoid dependency on pre-existing fixed credentials.

### `products/create-product.cy.js`

Validates the `POST /produtos` endpoint with the following documented scenarios:

- `201` for successful creation
- `400` for duplicated product name
- `401` for missing, invalid, or expired token
- `403` for administrator-only route

The tests use a dynamic admin session and also create a non-admin user to validate the forbidden authorization scenario.

### `carts/list-carts.cy.js`

Validates the `GET /carrinhos` endpoint with deterministic setup created through the API before the assertions run.

Covered scenarios:

- `200` for cart listing
- response structure validation
- cart uniqueness per user verification
- filters by `_id`, `idUsuario`, `precoTotal`, and `quantidadeTotal`

The setup creates an admin user, authenticates, creates a product, and creates a cart with `POST /carrinhos`, reducing dependency on pre-existing environment data.

## How to run

### Install dependencies

```bash
npm install
```

### Open the Cypress UI

```bash
npm run cy:open
```

### Run all tests

```bash
npm run cy:run
```

### Run a specific spec

```bash
npx cypress run --spec cypress/e2e/auth/login.cy.js
npx cypress run --spec cypress/e2e/products/create-product.cy.js
npx cypress run --spec cypress/e2e/carts/list-carts.cy.js
```

## Applied best practices

- Dynamic data usage to avoid collisions between test executions
- Separation between test data, reusable logic, and test scenarios
- Domain-based custom commands for better readability
- Use of `failOnStatusCode: false` in negative scenarios to validate 4xx responses without automatic Cypress failure
- Deterministic setup for listing tests that depend on existing data

## Suggested next steps

- Add response schema validation
- Create negative tests for `POST /carrinhos`, including duplicated product, nonexistent product, and insufficient quantity
- Add data cleanup when needed for repeatable pipeline executions
- Evolve the custom commands with typing and additional documentation

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
