context('Roles Settings Page :: Create Role', () => {
    specify('Happy path', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.intercept({ method: 'GET', url: '**/api/roles*' }).as('getRoles');
        cy.intercept({ method: 'GET', url: '**/api/role-types' }).as('getRoleTypes');
        cy.intercept({ method: 'POST', url: '**/api/roles' }).as('createRole');
        cy.visit('/settings/roles');
        cy.wait('@getRoles');
        cy.wait('@getRoleTypes');
        cy.get('.create-update-role-block').should('not.exist');

        cy.get('button').contains('Add Role').click();
        cy.get('.create-update-role-block');
        cy.fillStringField('name', `Test Role ${new Date().getTime()}@email.com`);
        cy.get('[data-test-id="roleType"]').click();
        cy.get('.select__option').contains('carrierAdmin').click();
        cy.get('div').contains('carrier.orders.view_any').click();
        cy.get('div').contains('carrier.my_orders.orders.mark_as_paid').click();
        cy.get('div').contains('carrier.administration.role_settings.view_any').click();
        cy.get('button').contains('Create').click();

        cy.get('@createRole');
        cy.wait('@getRoles');
        cy.get('.create-update-role-block').should('not.exist');
        cy.get('.Toastify__toast').contains('Role has been successfully created');
    });
});
