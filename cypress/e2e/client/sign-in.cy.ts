context('Sign In Page', () => {
    specify('Happy Path', () => {
        cy.visit('/sign-in');

        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();

        cy.location('pathname').should('eq', '/');
        cy.get('div').contains('Staff Managment');

        // and not available for sign in again, while session exists
        cy.visit('/sign-in');
        cy.location('pathname').should('eq', '/');
    });

    specify('Wrong email or password', () => {
        cy.visit('/sign-in');

        cy.fillStringField('email', 'carrierowner555@example2.com');
        cy.fillStringField('password', 'carrierOwner1123');
        cy.get('button').contains('Sign In').click();

        cy.get('.alert-block').contains('Incorrect email or password.').contains('Please double-check and try again.');
    });
});
