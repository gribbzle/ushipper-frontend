// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    interface Chainable {
        fillStringField(fieldName: string, value: string, formName?: string): void;
    }
}

Cypress.Commands.add('fillStringField', (fieldName: string, value: string, formName?: string) => {
    if (formName) {
        cy.get(`form[name='${formName}'] input[name='${fieldName}']`).type(value);
    } else {
        cy.get(`input[name='${fieldName}']`).type(value);
    }
});
