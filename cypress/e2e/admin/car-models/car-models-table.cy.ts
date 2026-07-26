context('Car Models Settings Page :: Car Models Table', () => {
    specify('Filters', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        cy.intercept({ method: 'GET', url: '**/api/car-models**' }).as('getCarModels');
        cy.intercept({ method: 'GET', url: '**/api/car-makers**' }).as('getCarMakers');
        cy.visit('/admin/settings/car-models');
        cy.wait('@getCarModels');

        cy.get('.car-models-filters input[name="modelName"]').type('abc');
        cy.wait('@getCarModels').should(xhr => {
            expect(xhr.request.url).to.contains('model_name=abc');
        });
        cy.get('.car-models-filters input[name="modelName"]').clear();
        cy.wait('@getCarModels').should(xhr => {
            expect(xhr.request.url).to.not.contains('model_name=');
        });

        cy.get('.car-models-filters [data-test-id="maker"]').click();
        cy.get('.car-models-filters [data-test-id="maker"]').type('Aston');
        cy.wait('@getCarMakers');
        cy.get('.select__option').contains('Aston Martin').click();
        cy.wait('@getCarModels').should(xhr => {
            expect(xhr.request.url).to.contains('maker_id=');
        });

        cy.get('.car-models-filters [data-test-id="maker"]').click();
        cy.get('.car-models-filters [data-test-id="maker"]').type('Test');
        cy.wait('@getCarMakers');
        cy.get('.car-models-filters input[name="modelName"]').focus();
        cy.wait('@getCarModels').should(xhr => {
            expect(xhr.request.url).to.not.contains('maker_id=');
        });
    });
});
