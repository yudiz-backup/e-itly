import { agencyId, baseURL } from "../../config";

context("Agency Flow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "agency/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=agencyName]").should("exist");
        cy.get("[data-cy=location]").should("exist");
    });

    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=addEditAgencySave]").click();
        cy.get("[data-cy=agencyNameError]").should("be.visible");
        cy.get("[data-cy=agencyNameError]").should(
            "contain",
            "Agency Name is required."
        );
        cy.get("[data-cy=locationError]").should("be.visible");
        cy.get("[data-cy=locationError]").should(
            "contain",
            "Location is required."
        );
    });

    it("Should successfully add a new Agency", () => {
        cy.intercept("POST", "api/agency").as("apiCall");
        cy.get("[data-cy=agencyName]").type("New Agency Name");
        cy.get("[data-cy=location]").type("New Location");
        cy.get("[data-cy=addEditAgencySave]").click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'agency')
    });

    it('should edit an existing agency', () => {

        const editUrl = `agency/edit?agencyId=${agencyId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/agency/${agencyId}`).as("apiCall");
        cy.get('[data-cy=agencyName]').clear().type('Edited Agency Name');
        cy.get('[data-cy=location]').clear().type('Edited Location');
        cy.get('[data-cy=addEditAgencySave]').click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'agency')
    });

    it('should cancel and navigate back to the agency list', () => {
        cy.get('[data-cy=cancelAgencyBtn]').click();
        cy.url().should('include', 'agency');
    });
});
