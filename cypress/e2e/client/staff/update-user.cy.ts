context('Staff Page :: Update User', () => {
    specify('Happy path (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'GET', url: '**/api/users/*' }).as('getUser');
        cy.intercept({ method: 'POST', url: '**/api/users/*' }, { statusCode: 200 }).as('updateUser');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.get('div[data-test-id="staff-table-actions"]').eq(0).click();
        cy.get('div[data-test-id="staff-table-actions"] .dropdown__option').contains('Edit').click();
        cy.wait('@getUser');

        cy.get('button').contains('Save User').click();
        cy.wait('@updateUser');
        cy.get('.Toastify__toast').contains('User has been successfully updated');
        cy.get('.create-edit-staff-drawer .drawer__head').should('not.visible');
    });
});
