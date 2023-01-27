describe('Users Page', () => {
    it('should load user table', () => {
        cy.visit('/');
        cy.get('[routerLink="users"]').click();
        cy.get('mat-table');
    });
    it('should display right column names', () => {
        cy.visit('/');
        cy.get('[routerLink="users"]').click();
        cy.contains('Id');
        cy.contains('Name');
        cy.contains('Username');
        cy.contains('Email');
        cy.contains('Role');
    });
    it('should navigate to next page', () => {
        cy.visit('/');
        cy.get('[routerLink="users"]').click();
        cy.get('[aria-label="Next page"]').click();
    });
    it('should filter users by username', () => {
        cy.visit('/');
        cy.get('[routerLink="users"]').click();
        cy.get('[placeholder="Search by username"]').type('sasha', {force: true});
        cy.get('mat-table').find('mat-row').should('have.length', 3);
    })
});