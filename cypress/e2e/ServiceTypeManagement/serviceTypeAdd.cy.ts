import { baseURL, serviceTypeId } from "../../config";

context("ServiceType Flow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "service-Type/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=serviceType]").should("exist");
    });
    ``
    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=addEditServiceTypeSave]").click();
        cy.get("[data-cy=serviceTypeError]").should("be.visible");
        cy.get("[data-cy=serviceTypeError]").should(
            "contain",
            "Service Type is required."
        );
    });

    it("Should successfully add a new serviceType", () => {
        cy.intercept("POST", "api/serviceType").as("apiCall");
        cy.get("[data-cy=serviceType]").type("New ServiceType");
        cy.get("[data-cy=addEditServiceTypeSave]").click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'service-type')
    });

    it('should edit an existing serviceType', () => {
        const editUrl = `service-type/edit?serviceTypeId=${serviceTypeId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/serviceType/${serviceTypeId}`).as("apiCall");
        cy.get('[data-cy=serviceType]').clear().type('Edited ServiceType');
        cy.get('[data-cy=addEditServiceTypeSave]').click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'service-type')
    });

    it('should cancel and navigate back to the serviceType list', () => {
        cy.get('[data-cy=cancelServiceTypeBtn]').click();
        cy.url().should('include', 'service-type');
    });
});
