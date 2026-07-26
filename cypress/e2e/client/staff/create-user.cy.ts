context('Staff Page :: Create User', () => {
    specify('Happy path', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.get('button').contains('Add User').click();
        cy.get('.create-edit-staff-drawer .drawer__head').contains('New User');
        cy.get('[name="avatar"]').attachFile('avatar-example.jpg').trigger('change');
        cy.fillStringField('name', 'Some-Name', 'create-edit-user-form');
        cy.fillStringField('email', `Email${new Date().getTime()}@email.com`);
        cy.get('form[name="create-edit-user-form"] [data-test-id="role"]').click();
        cy.get('.select__option').contains('CarrierDriver').click();
        cy.get('form[name="create-edit-user-form"] input[name="phone"]').type('2345' + Math.floor(Math.random() * 1_000_000).toString());
        cy.fillStringField('password', 'Password2');
        cy.fillStringField('passwordConfirmation', 'Password2');
        cy.get('[data-test-id="isActive"] .switch-input__label').click();
        cy.get('.create-edit-staff-drawer .drawer__actions button').contains('Add User').click();

        cy.get('.Toastify__toast').contains('User has been successfully created');
        cy.get('.create-edit-staff-drawer .drawer__head').should('not.visible');
    });
});
