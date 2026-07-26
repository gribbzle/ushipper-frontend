context('Password recovery page', () => {
    specify('Happy path', () => {
        cy.intercept(
            { method: 'POST', url: '**/api/passwords/requests' },
            {
                statusCode: 200,
                body: { data: {} },
            },
        ).as('passwordRecovery');

        cy.visit('/password-recovery');

        cy.fillStringField('email', 'RandomEmail123@321glmai.ru');
        cy.get('button').contains('Send me Reset Link').click();
        cy.wait('@passwordRecovery');
        cy.get('div').contains('We’ve sent a link to your email.').contains('Please finish your password recovery by following this link.');
    });

    specify('Wrong email (422)', () => {
        cy.intercept(
            { method: 'POST', url: '**/api/passwords/requests' },
            {
                statusCode: 422,
                body: { message: 'The selected email is invalid.', errors: { email: ['The selected email is invalid.'] } },
            },
        ).as('passwordRecovery');

        cy.visit('/password-recovery');

        cy.fillStringField('email', 'RandomEmail123@321glmai.ru');
        cy.get('button').contains('Send me Reset Link').click();
        cy.wait('@passwordRecovery');
        cy.get('.string-input__help').contains('The selected email is invalid.');
    });
});
