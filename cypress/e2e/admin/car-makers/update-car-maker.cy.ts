context('Car Makers Settings Page :: Update Car Maker', () => {
    specify('Happy path', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'GET', url: '**/api/car-makers/*' }).as('getCarMaker');
        cy.intercept({ method: 'PATCH', url: '**/api/car-makers/*' }).as('updateCarMaker');
        cy.visit('/admin/settings/car-makers');
        cy.get('[data-test-id="car-makers-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Edit').click();
        cy.wait('@getCarMaker');
        cy.get('.create-update-car-maker-drawer').should('be.visible');
        cy.get('.create-update-car-maker-drawer button').contains('Save Maker').click();
        cy.wait('@updateCarMaker');

        cy.get('.Toastify__toast').contains('Car Maker has been successfully updated');
        cy.get('.create-update-car-maker-drawer').should('not.visible');
    });
});
