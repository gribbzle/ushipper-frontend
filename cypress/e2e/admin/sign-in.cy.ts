context('Admin Sign In Page', () => {
    specify('Happy Path', () => {
        cy.visit('/admin/sign-in');

        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();

        cy.location('pathname').should('eq', '/admin');
        cy.get('div').contains('Administrators Managment');

        // and not available for sign in again, while session exists
        cy.visit('/admin/sign-in');
        cy.location('pathname').should('eq', '/admin');
    });

    specify('Wrong email or password', () => {
        cy.visit('/admin/sign-in');

        cy.fillStringField('email', 'admin135@company7.com');
        cy.fillStringField('password', 'justA134dmin1');
        cy.get('button').contains('Sign In').click();

        cy.get('.alert-block').contains('Incorrect email or password.').contains('Please double-check and try again.');
    });
});
