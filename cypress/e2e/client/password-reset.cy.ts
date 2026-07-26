const RESET_PASSWORD_CODE = 'TEST_RESET_PASSWORD_CODE';

const visitResetPasswordPage = () => cy.visit(`/password-reset?code=${RESET_PASSWORD_CODE}`);

context('Password reset page', () => {
    specify('Happy path', () => {
        cy.intercept(
            { method: 'POST', url: '**/api/passwords' },
            {
                statusCode: 200,
                body: { data: {} },
            },
        ).as('resetPassword');

        visitResetPasswordPage();
        cy.fillStringField('newPassword', 'Password2');
        cy.fillStringField('newPasswordConfirmation', 'Password2');
        cy.get('button').contains('Save New Password').click();
        cy.wait('@resetPassword').should(({ request }) => {
            expect(request.body['verify_code']).to.equal(RESET_PASSWORD_CODE);
        });

        cy.get('div').contains('You are done!').contains('Please sign in with your new password.');
    });

    specify('Some error (422)', () => {
        cy.intercept(
            { method: 'POST', url: '**/api/passwords' },
            {
                statusCode: 422,
                body: { data: {} },
            },
        ).as('resetPassword');

        visitResetPasswordPage();
        cy.fillStringField('newPassword', 'Password2');
        cy.fillStringField('newPasswordConfirmation', 'Password2');
        cy.get('button').contains('Save New Password').click();
        cy.wait('@resetPassword').should(({ request }) => {
            expect(request.body['verify_code']).to.equal(RESET_PASSWORD_CODE);
        });

        cy.get('.alert-block--view-warning').contains('Your link is invalid.');
    });
});
