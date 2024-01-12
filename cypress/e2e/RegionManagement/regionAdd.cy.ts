import { baseURL, regionId } from "../../config";

context("Region Flow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "region/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=regionName]").should("exist");
    });

    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=addEditRegionSave]").click();
        cy.get("[data-cy=regionNameError]").should("be.visible");
        cy.get("[data-cy=regionNameError]").should(
            "contain",
            "Region Name is required."
        );
    });

    it("Should successfully add a new region", () => {
        cy.intercept("POST", "api/region").as("apiCall");
        cy.get("[data-cy=regionName]").type("New Region Name");
        cy.get("[data-cy=addEditRegionSave]").click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'region')
    });

    it('should edit an existing region', () => {
        const editUrl = `region/edit?regionId=${regionId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/region/${regionId}`).as("apiCall");
        cy.get('[data-cy=regionName]').clear().type('Edited Region Name');
        cy.get('[data-cy=addEditRegionSave]').click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'region')
    });

    it('should cancel and navigate back to the region list', () => {
        cy.get('[data-cy=cancelRegionBtn]').click();
        cy.url().should('include', 'region');
    });
});
    