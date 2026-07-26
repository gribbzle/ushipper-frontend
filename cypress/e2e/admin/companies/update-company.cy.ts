context('Companies Page :: Update Company', () => {
    specify('Happy path (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'PATCH', url: '**/api/companies/*' }, { statusCode: 200 }).as('updateCompany'); // TO DO: убрать мок
        cy.intercept({ method: 'GET', url: '**/api/companies/*' }).as('getCompany');
        cy.visit('/admin/companies');
        cy.get('div[data-test-id="companies-table-actions"]').eq(0).click();
        cy.get('div[data-test-id="companies-table-actions"] .dropdown__option').contains('Edit').click();
        cy.wait('@getCompany');

        cy.get('button').contains('Save Company').click();
        cy.wait('@updateCompany');
        cy.get('.Toastify__toast').contains('Company has been successfully updated');
        cy.get('.create-edit-company-drawer .drawer__head').should('not.visible');
    });
});
