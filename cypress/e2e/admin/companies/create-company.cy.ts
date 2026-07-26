context('Companies Page :: Create Company', () => {
    specify('Happy path', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'POST', url: '**/api/companies' }, { statusCode: 200 }).as('createCompany'); // TO DO: убрать мок, когда разрешат цифры в названии компании
        cy.visit('/admin/companies');
        cy.get('button').contains('Add Company').click();
        cy.get('.create-edit-company-drawer .drawer__head').contains('New Company');
        cy.fillStringField('name', 'Company');
        cy.get('[data-test-id="type"]').click();
        cy.get('.select__option').contains('Carrier').click();
        cy.fillStringField('email', `Email${new Date().getTime()}@email.com`);
        cy.fillStringField('phone', '2345' + Math.floor(Math.random() * 1_000_000).toString());
        cy.get('[data-test-id="isActive"] .switch-input__label').click();

        cy.fillStringField('ownerName', 'OwnerName');
        cy.fillStringField('ownerEmail', `Email${new Date().getTime()}@email.com`);
        cy.get('[name="ownerAvatar"]').attachFile('avatar-example.jpg').trigger('change');
        cy.fillStringField('ownerPassword', 'Password2');
        cy.fillStringField('ownerPasswordConfirmation', 'Password2');
        cy.get('.create-edit-company-drawer button').contains('Add Company').click();
        cy.get('@createCompany');

        cy.get('.Toastify__toast').contains('Company has been successfully created');
        cy.get('.create-edit-company-drawer .drawer__head').should('not.visible');
    });
});
