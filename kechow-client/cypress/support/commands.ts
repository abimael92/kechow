/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Log in as delivery driver (visits login, fills form, submits).
       * Uses session to cache login across tests when possible.
       */
      loginAsDelivery(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsDelivery', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/login');
      cy.get('input[name="email"], input[type="email"]').first().clear().type(email);
      cy.get('input[name="password"], input[type="password"]').first().clear().type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
    },
    { cacheAcrossSpecs: false }
  );
});

export {};
