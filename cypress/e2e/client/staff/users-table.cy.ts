context('Staff Page :: Users Table', () => {
    specify('Filters', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'GET', url: '**/api/users*' }).as('getUsers');
        cy.intercept({ method: 'GET', url: '**/api/user-statuses' }).as('getUserStatuses');
        cy.intercept({ method: 'GET', url: '**/api/roles*' }).as('getUserRoles');

        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');

        cy.wait('@getUsers');
        cy.wait('@getUserStatuses');
        cy.wait('@getUserRoles');

        cy.get('.staff-filters').fillStringField('name', 'SomeName');
        cy.wait('@getUsers').should(xhr => {
            expect(xhr.request.url).to.contains('name=SomeName');
        });

        cy.get('.staff-filters').fillStringField('phone', '123');
        cy.wait('@getUsers').should(xhr => {
            expect(xhr.request.url).to.contains('phone=123');
        });
    });
});
