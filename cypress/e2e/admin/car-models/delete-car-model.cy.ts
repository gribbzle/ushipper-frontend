context('Car Models Settings Page :: Delete Car Model', () => {
    specify('Happy path from table (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'GET', url: '**/api/car-models*' }).as('getCarModels');
        cy.intercept({ method: 'DELETE', url: '**/api/car-models/*' }, { statusCode: 200 }).as('deleteCarModel');
        cy.visit('/admin/settings/car-models');
        cy.wait('@getCarModels');

        cy.get('[data-test-id="car-models-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteCarModel');

        cy.get('.popup').should('not.exist');
        cy.get('.Toastify__toast').contains('Car Model has been successfully deleted');
        cy.get('@getCarModels');
    });

    specify('Happy path from edit block (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'GET', url: '**/api/car-models*' }).as('getCarModels');
        cy.intercept({ method: 'DELETE', url: '**/api/car-models/*' }, { statusCode: 200 }).as('deleteCarModel');
        cy.visit('/admin/settings/car-models');
        cy.wait('@getCarModels');

        cy.get('[data-test-id="car-models-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Edit').click();
        cy.get('.create-edit-car-model-drawer').should('be.visible');
        cy.get('button').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteCarModel');

        cy.get('.create-edit-car-model-drawer').should('not.visible');
        cy.get('.popup').should('not.exist');
        cy.get('.Toastify__toast').contains('Car Model has been successfully deleted');
        cy.get('@getCarModels');
    });
});
