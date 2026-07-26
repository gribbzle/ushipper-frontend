context('Roles Settings Page :: Delete Role', () => {
    specify('Happy path from table (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.intercept({ method: 'GET', url: '**/api/roles*' }).as('getRoles');
        cy.intercept({ method: 'DELETE', url: '**/api/roles/*' }, { statusCode: 200 }).as('deleteRole');
        cy.visit('/settings/roles');
        cy.wait('@getRoles');

        cy.get('[data-test-id="roles-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteRole');

        cy.get('.popup').should('not.exist');
        cy.get('.Toastify__toast').contains('Role has been successfully deleted');
        cy.get('@getRoles');
    });

    specify('Happy path from edit block (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.intercept({ method: 'GET', url: '**/api/roles*' }).as('getRoles');
        cy.intercept({ method: 'DELETE', url: '**/api/roles/*' }, { statusCode: 200 }).as('deleteRole');
        cy.visit('/settings/roles');
        cy.wait('@getRoles');

        cy.get('[data-test-id="roles-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Edit').click();
        cy.get('.create-update-role-block');
        cy.get('button').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteRole');

        cy.get('.create-update-role-block').should('not.exist');
        cy.get('.popup').should('not.exist');
        cy.get('.Toastify__toast').contains('Role has been successfully deleted');
        cy.get('@getRoles');
    });
});
