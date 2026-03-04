// Cypress E2E support — runs before each spec
import './commands';

beforeEach(() => {
  // Optional: clear localStorage to start tests from a clean state when needed
  // cy.clearLocalStorage();
});
