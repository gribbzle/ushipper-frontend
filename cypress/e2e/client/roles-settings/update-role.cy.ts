context('Roles Settings Page :: Update Role', () => {
    specify('Happy path', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.intercept({ method: 'GET', url: '**/api/roles*' }).as('getRoles');
        cy.intercept({ method: 'PATCH', url: '**/api/roles/*' }).as('updateRole');
        cy.visit('/settings/roles');
        cy.wait('@getRoles');

        cy.get('[data-test-id="roles-table-actions"] .dropdown__control').eq(0).click();
        cy.get('.dropdown__option').contains('Edit').click();
        cy.get('.create-update-role-block');
        cy.get('button').contains('Save Settings').click();
        cy.wait('@updateRole');

        cy.get('.Toastify__toast').contains('Role has been successfully updated');
        cy.get('@getRoles');
    });
});
