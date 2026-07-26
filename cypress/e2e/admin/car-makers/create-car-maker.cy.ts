context('Car Makers Settings Page :: Create Car Maker', () => {
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

        cy.intercept({ method: 'POST', url: '**/api/car-makers' }).as('createCarMaker');
        cy.visit('/admin/settings/car-makers');
        cy.get('button').contains('Add Maker').click();
        cy.get('.create-update-car-maker-drawer').should('be.visible');
        cy.get('.create-update-car-maker-drawer input[name="name"]').type(`Test Car Maker ${new Date().getTime()}`);
        cy.get('.create-update-car-maker-drawer button').contains('Add Maker').click();
        cy.wait('@createCarMaker');

        cy.get('.Toastify__toast').contains('Car Maker has been successfully created');
        cy.get('.create-update-car-maker-drawer').should('not.visible');
    });
});
