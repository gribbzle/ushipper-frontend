context('Car Models Settings Page :: Update Car Model', () => {
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

        cy.intercept({ method: 'GET', url: '**/api/car-models**' }).as('getCarModels');
        cy.intercept({ method: 'GET', url: '**/api/car-makers**' }).as('getCarMakers');
        cy.intercept({ method: 'GET', url: '**/api/car-models/*' }).as('getCarModel');
        cy.intercept({ method: 'PATCH', url: '**/api/car-models/*' }).as('updateCarModel');
        cy.visit('/admin/settings/car-models');
        cy.wait('@getCarModels');
        cy.get('[data-test-id="car-models-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Edit').click();
        cy.wait('@getCarModel');
        cy.wait('@getCarMakers');
        cy.get('.create-edit-car-model-drawer').should('be.visible');
        cy.get('.create-edit-car-model-drawer button').contains('Save Model').click();
        cy.wait('@updateCarModel');

        cy.get('.Toastify__toast').contains('Car Model has been successfully updated');
        cy.get('.create-edit-car-model-drawer').should('not.visible');
        cy.wait('@getCarModels');
    });
});
