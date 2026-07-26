context('Staff Page :: Delete User', () => {
    specify('Happy path from update modal (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'GET', url: '**/api/users/*' }).as('getUser');
        cy.intercept({ method: 'DELETE', url: '**/api/users/*' }, { statusCode: 200 }).as('deleteUser');
        cy.intercept({ method: 'GET', url: '**/api/users*' }).as('getUsers');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.wait('@getUsers');
        cy.get('div[data-test-id="staff-table-actions"]').eq(0).click();
        cy.get('div[data-test-id="staff-table-actions"] .dropdown__option').contains('Edit').click();
        cy.wait('@getUser');

        cy.get('button').contains('Delete User').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteUser');

        cy.get('.Toastify__toast').contains('User has been successfully deleted');
        cy.get('.popup').should('not.exist');
        cy.get('.create-edit-staff-drawer .drawer__head').should('not.visible');
        cy.wait('@getUsers');
    });

    specify('Happy path from table (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'GET', url: '**/api/users/*' }).as('getUser');
        cy.intercept({ method: 'DELETE', url: '**/api/users/*' }, { statusCode: 200 }).as('deleteUser');
        cy.intercept({ method: 'GET', url: '**/api/users*' }).as('getUsers');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.wait('@getUsers');
        cy.get('div[data-test-id="staff-table-actions"]').eq(0).click();
        cy.get('div[data-test-id="staff-table-actions"] .dropdown__option').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteUser');

        cy.get('.Toastify__toast').contains('User has been successfully deleted');
        cy.get('.popup').should('not.exist');
        cy.get('.create-edit-staff-drawer .drawer__head').should('not.visible');
        cy.wait('@getUsers');
    });
});
