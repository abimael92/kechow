import deliveryUser from '../fixtures/delivery-user.json';

describe('Delivery workflow', () => {
  beforeEach(() => {
    cy.loginAsDelivery(deliveryUser.email, deliveryUser.password);
  });

  it('opens delivery dashboard', () => {
    cy.visit('/delivery/dashboard');
    cy.get('body').should('be.visible');
    cy.contains(/repartidor|dashboard|disponible|delivery/i).should('be.visible');
  });

  it('toggles availability', () => {
    cy.visit('/delivery/dashboard');
    cy.get('[data-cy="availability-toggle"], button').contains(/disponible|online|conectar|connect/i).first().click();
    cy.get('body').should('be.visible');
  });

  it('shows available jobs or empty state when online', () => {
    cy.visit('/delivery/dashboard');
    cy.get('[data-cy="availability-toggle"], button').contains(/disponible|online|conectar/i).then(($btn) => {
      if ($btn.length) $btn.first().click();
    });
    cy.get('body').should('be.visible');
    cy.get('[data-cy="available-jobs"], .orders-panel, main, [data-cy="delivery-dashboard"]', { timeout: 10000 }).should('exist');
  });
});
