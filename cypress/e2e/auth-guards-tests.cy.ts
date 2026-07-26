context('Password recovery page', () => {
    specify('Not authorized', () => {
        cy.visit('/staff');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/sign-in');
        });

        cy.visit('/admin/orders');
        cy.get('h4').contains('Administrator');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin/sign-in');
        });
    });

    specify('Authorized as CarrierOwner', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'DELETE', url: '**/api/tokens/**' }).as('logout');

        // Sign in as CarrierOwner
        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });

        // Watch available page
        cy.visit('/staff');
        cy.get('div').contains('Staff Managment');

        // Try watch not available page
        cy.visit('/admin/orders');
        cy.get('h4').contains('Administrator');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin/sign-in');
        });

        // Logout
        cy.visit('/staff');
        cy.get('div').contains('Staff Managment');
        cy.get('.header-user-block .dropdown').click();
        cy.get('.dropdown__option').contains('Logout').click();
        cy.wait('@logout');

        // Watch available page
        cy.visit('/staff');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/sign-in');
        });
    });

    specify('Authorized as Admin', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');
        cy.intercept({ method: 'DELETE', url: '**/api/tokens/**' }).as('logout');

        // Sign in as Admin
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        // Watch available page
        cy.visit('/admin/orders');
        cy.get('div').contains('ORDERS');

        // Try watch not available page
        cy.visit('/staff');
        cy.get('h1').contains('Sign In');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/sign-in');
        });

        // Logout
        cy.visit('/admin/orders');
        cy.get('div').contains('ORDERS');
        cy.get('.header-user-block .dropdown').click();
        cy.get('.dropdown__option').contains('Logout').click();
        cy.wait('@logout');

        // Watch available page
        cy.visit('/admin/orders');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin/sign-in');
        });
    });

    specify('Switch CarrierOwner to Admin', () => {
        cy.intercept({ method: 'POST', url: '**/api/tokens' }).as('signIn');

        // Sign in as CarrierOwner
        cy.visit('/sign-in');
        cy.fillStringField('email', 'carrierowner@example2.com');
        cy.fillStringField('password', 'carrierOwner1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/');
        });

        // Watch available page
        cy.visit('/staff');
        cy.get('div').contains('Staff Managment');

        // Try watch not available page
        cy.visit('/admin/orders');
        cy.get('h4').contains('Administrator');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin/sign-in');
        });

        // Sign in as Admin
        cy.visit('/admin/sign-in');
        cy.fillStringField('email', 'admin@company7.com');
        cy.fillStringField('password', 'justAdmin1');
        cy.get('button').contains('Sign In').click();
        cy.wait('@signIn');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/admin');
        });

        // Watch available page
        cy.visit('/admin/orders');
        cy.get('div').contains('ORDERS');

        // Try watch not available page
        cy.visit('/staff');
        cy.get('h1').contains('Sign In');
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/sign-in');
        });
    });
});
