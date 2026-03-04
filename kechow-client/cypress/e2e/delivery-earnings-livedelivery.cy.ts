import deliveryUser from '../fixtures/delivery-user.json';

describe('Delivery earnings and LiveDelivery', () => {
  beforeEach(() => {
    cy.loginAsDelivery(deliveryUser.email, deliveryUser.password);
  });

  it('earnings page loads', () => {
    cy.visit('/delivery/earnings');
    cy.get('body').should('be.visible');
    cy.contains(/ganancias|earnings|hoy|today|total/i).should('be.visible');
  });

  it('LiveDelivery page loads', () => {
    cy.visit('/delivery/dashboard');
    cy.get('body').should('be.visible');
    cy.visit('/delivery/live/1');
    cy.get('body').should('be.visible');
  });
});
