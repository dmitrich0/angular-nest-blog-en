import {EMAIL, PASSWORD} from "./constants";

describe('Test Login Flow', () => {
    it('should login user', () => {
        cy.visit('/login');
        cy.get('[formcontrolname=email]').type(EMAIL);
        cy.get('[formcontrolname=password]').type(PASSWORD);
        cy.get('[type=submit]').click();
        cy.url().should('include', 'admin');
    });
})