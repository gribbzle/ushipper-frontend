context('Sign Up Page', () => {
    specify('Happy Path', () => {
        cy.intercept({ method: 'POST', url: '**/api/registration' }).as('signUp');
        cy.visit('/sign-up');

        cy.get('h4').contains('Choose Account Type');
        cy.get('h4').contains('Carrier Account').click();
        cy.get('button').contains('Continue').click();

        cy.fillStringField('companyName', 'Company-Name');
        cy.fillStringField('firstName', 'First-Name');
        cy.fillStringField('lastName', 'Last-Name');
        cy.fillStringField('email', `Email${new Date().getTime()}@email.com`);
        cy.fillStringField('phone', '2345' + Math.floor(Math.random() * 1_000_000).toString());
        cy.fillStringField('password', 'Password2');
        cy.get('[data-test-id="userAgreesWithTerms"] .switch-input__switch').click();
        cy.get('button').contains('Continue').click();

        cy.wait('@signUp').should(xhr => {
            expect(xhr.response?.statusCode).to.equal(201);
        });

        cy.get('.alert-block').contains('We’ve sent a link to your email.').contains('Please finish your registration by following this link.');
    });

    specify('Error Path (email has already been taken)', () => {
        cy.intercept({ method: 'POST', url: '**/api/registration' }).as('signUp');
        cy.visit('/sign-up');

        cy.get('h4').contains('Choose Account Type');
        cy.get('h4').contains('Carrier Account').click();
        cy.get('button').contains('Continue').click();

        cy.fillStringField('companyName', 'Company-Name');
        cy.fillStringField('firstName', 'First-Name');
        cy.fillStringField('lastName', 'Last-Name');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('phone', '2345' + Math.floor(Math.random() * 1_000_000).toString());
        cy.fillStringField('password', 'Password2');
        cy.get('[data-test-id="userAgreesWithTerms"] .switch-input__switch').click();
        cy.get('button').contains('Continue').click();

        cy.wait('@signUp').should(xhr => {
            expect(xhr.response?.statusCode).to.equal(422);
        });
        cy.get('.string-input__help--warning').contains('The email has already been taken.');
    });
});
