import { agentId, baseURL } from "../../config";

context("Agent Flow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "agent/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=name]").should("exist");
        cy.get("[data-cy=email]").should("exist");
    });

    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=addEditAgentSave]").click();
        cy.get("[data-cy=nameError]").should("be.visible");
        cy.get("[data-cy=nameError]").should(
            "contain",
            "Agent Name is required."
        );
        cy.get("[data-cy=emailError]").should("be.visible");
        cy.get("[data-cy=emailError]").should(
            "contain",
            "Email is required."
        );
    });

    it("Should successfully add a new Agent", () => {
        cy.intercept("POST", "api/agent").as("apiCall");
        cy.get("[data-cy=name]").type("New Agent Name");
        cy.get("[data-cy=email]").type("newtestemail123@gmail.com");
        cy.get("[data-cy=addEditAgentSave]").click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'agent')
    });

    it('should edit an existing agent', () => {

        const editUrl = `agent/edit?agentId=${agentId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/agent/${agentId}`).as("apiCall");
        cy.get('[data-cy=name]').clear().type('Edited Agent Name');
        cy.get('[data-cy=email]').clear().type('newtestemail223@gmail.com');
        cy.get('[data-cy=addEditAgentSave]').click();
        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'agent')
    });

    it('should cancel and navigate back to the agent list', () => {
        cy.get('[data-cy=cancelAgentBtn]').click();
        cy.url().should('include', 'agent');
    });
});
