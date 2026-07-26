context('Companies Page :: Delete Company', () => {
    specify('Happy path from update modal (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'GET', url: '**/api/companies/*' }).as('getCompany');
        cy.intercept({ method: 'DELETE', url: '**/api/companies/*' }, { statusCode: 200 }).as('deleteCompany');
        cy.intercept({ method: 'GET', url: '**/api/companies*' }).as('getCompanies');

        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });
        cy.visit('/admin/companies');

        cy.wait('@getCompanies');
        cy.get('div[data-test-id="companies-table-actions"]').eq(0).click();
        cy.get('div[data-test-id="companies-table-actions"] .dropdown__option').contains('Edit').click();
        cy.wait('@getCompany');

        cy.get('button').contains('Delete Company').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteCompany');

        cy.get('.Toastify__toast').contains('Company has been successfully deleted');
        cy.get('.popup').should('not.exist');
        cy.get('.create-edit-company-drawer .drawer__head').should('not.visible');
        cy.wait('@getCompanies');
    });

    specify('Happy path from table (MOCKED)', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'DELETE', url: '**/api/companies/*' }, { statusCode: 200 }).as('deleteCompany');
        cy.intercept({ method: 'GET', url: '**/api/companies*' }).as('getCompanies');

        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });
        cy.visit('/admin/companies');

        cy.wait('@getCompanies');
        cy.get('div[data-test-id="companies-table-actions"]').eq(0).click();
        cy.get('div[data-test-id="companies-table-actions"] .dropdown__option').contains('Delete').click();
        cy.get('.popup button').contains('Delete').click();
        cy.wait('@deleteCompany');

        cy.get('.Toastify__toast').contains('Company has been successfully deleted');
        cy.get('.popup').should('not.exist');
        cy.get('.create-edit-company-drawer .drawer__head').should('not.visible');
        cy.wait('@getCompanies');
    });
});
