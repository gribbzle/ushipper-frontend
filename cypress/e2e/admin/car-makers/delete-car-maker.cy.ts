context('Car Makers Settings Page :: Delete Car Maker', () => {
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

        cy.intercept({ method: 'GET', url: '**/api/car-makers*' }).as('getCarMakers');
        cy.intercept({ method: 'DELETE', url: '**/api/car-makers/*' }, { statusCode: 200 }).as('deleteRole');
        cy.visit('/admin/settings/car-makers');
        cy.wait('@getCarMakers');

        cy.get('[data-test-id="car-makers-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteRole');

        cy.get('.popup').should('not.exist');
        cy.get('.Toastify__toast').contains('Car Maker has been successfully deleted');
        cy.get('@getCarMakers');
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

        cy.intercept({ method: 'GET', url: '**/api/car-makers*' }).as('getCarMakers');
        cy.intercept({ method: 'DELETE', url: '**/api/car-makers/*' }, { statusCode: 200 }).as('deleteRole');
        cy.visit('/admin/settings/car-makers');
        cy.wait('@getCarMakers');

        cy.get('[data-test-id="car-makers-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Edit').click();
        cy.get('.create-update-car-maker-drawer').should('be.visible');
        cy.get('button').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteRole');

        cy.get('.create-update-car-maker-drawer').should('not.visible');
        cy.get('.popup').should('not.exist');
        cy.get('.Toastify__toast').contains('Car Maker has been successfully deleted');
        cy.get('@getCarMakers');
    });
});
