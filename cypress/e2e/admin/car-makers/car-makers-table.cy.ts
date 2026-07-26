context('Car Makers Settings Page :: Car Makers Table', () => {
    specify('Filter by name', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'GET', url: '**/api/car-makers**' }).as('getCarMakers');
        cy.visit('/admin/settings/car-makers');
        cy.wait('@getCarMakers');

        cy.get('.car-makers-page__head input[name="name"]').type('abc');
        cy.wait('@getCarMakers').should(xhr => {
            expect(xhr.request.url).to.contains('name=abc');
        });

        cy.get('.car-makers-page__head input[name="name"]').clear();
        cy.wait('@getCarMakers').should(xhr => {
            expect(xhr.request.url).to.not.contains('name=');
        });
    });

    specify('Link to models page', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'GET', url: '**/api/car-makers**' }).as('getCarMakers');
        cy.intercept({ method: 'GET', url: '**/api/car-models**' }).as('getCarModels');
        cy.visit('/admin/settings/car-makers');
        cy.wait('@getCarMakers');

        cy.get('.car-makers-page a').contains(' Models').eq(0).click();
        cy.location().should(loc => {
            expect(loc.pathname).to.contains('/admin/settings/car-models');
        });
        cy.wait('@getCarModels');
        cy.wait('@getCarMakers');
    });
});
