import { baseURL, serviceId, testDescription, testExternalCost, testInternalCost, testRegionNameDropDown, testServiceName, testServiceTypeDropDown, testSupplierNameDropDown } from "../../config";

context("Service Flow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "services/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=serviceName]").should("exist");
        cy.get("[data-cy=serviceType]").should("exist");
        cy.get("[data-cy=supplierName]").should("exist");
        cy.get("[data-cy=regionName]").should("exist");
        cy.get("[data-cy=internalCost]").should("exist");
        cy.get("[data-cy=externalCost]").should("exist");
        cy.get("[data-cy=description]").should("exist");
    });

    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=addEditServicesBtn]").click();
        cy.get("[data-cy=serviceNameError]").should("be.visible");
        cy.get("[data-cy=serviceNameError]").should(
            "contain",
            "Service Name is required"
        );
        cy.get("[data-cy=serviceTypeError]").should("be.visible");
        cy.get("[data-cy=serviceTypeError]").should(
            "contain",
            "Service Type is required"
        );
        cy.get("[data-cy=supplierNameError]").should("be.visible");
        cy.get("[data-cy=supplierNameError]").should(
            "contain",
            "Supplier Name is required"
        );
        cy.get("[data-cy=regionNameError]").should("be.visible");
        cy.get("[data-cy=regionNameError]").should(
            "contain",
            "Region is required"
        );
        cy.get("[data-cy=internalCostError]").should("be.visible");
        cy.get("[data-cy=internalCostError]").should(
            "contain",
            "Internal Cost is required"
        );
        cy.get("[data-cy=externalCostError]").should("be.visible");
        cy.get("[data-cy=externalCostError]").should(
            "contain",
            "External Cost is required"
        );
        cy.get("[data-cy=descriptionError]").should("be.visible");
        cy.get("[data-cy=descriptionError]").should(
            "contain",
            "Description is required"
        );
    });

    it("Should successfully add a new services", () => {
        cy.intercept("POST", "api/service").as("apiCall");

        cy.get("[data-cy=serviceName]").type(testServiceName);

        cy.get("[data-cy=serviceType]").click();
        cy.get(".react-menu-list").contains(testServiceTypeDropDown).click();

        cy.get("[data-cy=supplierName]").click();
        cy.get(".react-menu-list").contains(testSupplierNameDropDown).click();

        cy.get("[data-cy=regionName]").click();
        cy.get(".react-menu-list").contains(testRegionNameDropDown).click();

        cy.get("[data-cy=internalCost]").type(testInternalCost);
        cy.get("[data-cy=externalCost]").type(testExternalCost);
        cy.get("[data-cy=description]").type(testDescription);

        cy.get("[data-cy=addEditServicesBtn]").click();

        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'services')
    });

    it('Should edit an existing service', () => {
        const editUrl = `services/edit?serviceId=${serviceId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/service/${serviceId}`).as("apiCall");

        cy.get('[data-cy=serviceName]').clear().type('Edited Service Name');

        cy.get("[data-cy=serviceType]").click();
        cy.get(".react-menu-list").contains(testServiceTypeDropDown).click();

        cy.get("[data-cy=supplierName]").click();
        cy.get(".react-menu-list").contains(testSupplierNameDropDown).click();

        cy.get("[data-cy=regionName]").click();
        cy.get(".react-menu-list").contains(testRegionNameDropDown).click();

        cy.get("[data-cy=internalCost]").clear().type("200");
        cy.get("[data-cy=externalCost]").clear().type("300");
        cy.get("[data-cy=description]").clear().type("edited description");

        cy.get("[data-cy=addEditServicesBtn]").click();

        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'services')
    })

    it('should cancel and navigate back to the service list', () => {
        cy.get('[data-cy=cancelServicesBtn]').click();
        cy.url().should('include', 'services');
    });

});
