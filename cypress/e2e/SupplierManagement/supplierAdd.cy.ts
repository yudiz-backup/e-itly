import { baseURL, supplierId } from "../../config";

context("Supplier Flow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "suppliers/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=supplierName]").should("exist");
        cy.get("[data-cy=email]").should("exist");
    });

    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=adEditSupplierSave]").click();
        cy.get("[data-cy=supplierNameError]").should("be.visible");
        cy.get("[data-cy=supplierNameError]").should(
            "contain",
            "Supplier Name is required."
        );
        cy.get("[data-cy=emailError]").should("be.visible");
        cy.get("[data-cy=emailError]").should(
            "contain",
            "Email is required."
        );
    });

    it("Should successfully add a new Supplier", () => {
        cy.intercept("POST", "api/supplier").as("apiCall");
        cy.get("[data-cy=supplierName]").type("New Supplier Name");
        cy.get("[data-cy=email]").type("newemail123test@gmaul.com");
        cy.get("[data-cy=adEditSupplierSave]").click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'supplier')
    });

    it('should edit an existing supplier', () => {

        const editUrl = `suppliers/edit?supplierId=${supplierId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/supplier/${supplierId}`).as("apiCall");
        cy.get('[data-cy=supplierName]').clear().type('Edited Supplier Name');
        cy.get('[data-cy=email]').clear().type('editedemail@gmail.com');
        cy.get('[data-cy=adEditSupplierSave]').click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'supplier')
    });

    it('should cancel and navigate back to the supplier list', () => {
        cy.get('[data-cy=cancelSupplier]').click();
        cy.url().should('include', 'supplier');
    });
});
