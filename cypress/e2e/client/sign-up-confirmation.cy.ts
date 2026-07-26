context('Sign up confirmation', () => {
    specify('Happy path', () => {
        cy.visit('/sign-up-confirmation?code=CORRECT_VERIFY_CODE');

        cy.get('h1').contains('You are done!');
        cy.get('button').contains('Go to Sign In page');
    });

    specify('Bad link', () => {
        cy.visit('/sign-up-confirmation?code=INCORRECT_VERIFY_CODE');

        cy.get('h1').contains('Error!');
        cy.get('.alert-block--view-warning').contains('Your link is invalid.');
        cy.get('button').contains('Contact Support');
    });
});
