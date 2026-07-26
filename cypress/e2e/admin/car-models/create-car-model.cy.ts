context('Car Model Settings Page :: Create Car Model', () => {
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

        cy.intercept({ method: 'POST', url: '**/api/car-models' }).as('createCarModel');
        cy.intercept({ method: 'GET', url: '**/api/car-makers**' }).as('createCarMakers');
        cy.visit('/admin/settings/car-models');
        cy.get('button').contains('Add Model').click();
        cy.get('.create-edit-car-model-drawer').should('be.visible');
        cy.get('.create-edit-car-model-drawer [data-test-id="maker"]').click();
        cy.get('.create-edit-car-model-drawer [data-test-id="maker"]').type('Aston');
        cy.get('.select__option').contains('Aston Martin').click();
        cy.get('.create-edit-car-model-drawer input[name="name"]').type(`Test Car Model ${new Date().getTime()}`);
        cy.wait('@createCarMakers');
        cy.get('.create-edit-car-model-drawer input[name="weight"]').type('123');
        cy.get('.create-edit-car-model-drawer button').contains('Add Model').click();
        cy.wait('@createCarModel');

        cy.get('.Toastify__toast').contains('Car Model has been successfully created');
        cy.get('.create-edit-car-model-drawer').should('not.visible');
    });
});
