import { baseURL, blockId, testBlockName, testDescription, testTitle } from "../../config";

context("Block FLow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "blocks/add-block")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=blockName]").should("exist");
        cy.get("[data-cy=blockImage]").should("exist");
        cy.get(".tox-edit-area__iframe").its('0.contentDocument.body')
    });

    it("Should give error if form fields are not filled", () => {
        cy.get("[data-cy=addEditBlockBtn]").click();
        cy.get("[data-cy=blockNameError]").should("be.visible");
        cy.get("[data-cy=blockNameError]").should(
            "contain",
            "Block Name is required."
        );
        cy.get("[data-cy=blockEditorError]").should("be.visible");
        cy.get("[data-cy=blockEditorError]").should(
            "contain",
            "Block Editor is required."
        );
    });


    it("Should successfully add a new block", () => {
        cy.intercept("POST", "api/block").as("apiCall");

        cy.get("[data-cy=blockName]").type(testBlockName);
        cy.get('.tox-edit-area__iframe').then(($iframe) => {
            const iframeDoc = $iframe.contents();
            const editorBody = iframeDoc.find('body');
            cy.wrap(editorBody).type(testDescription);
        });

        cy.get("[data-cy=addEditBlockBtn]").click();

        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'blocks')
    });

    it('should edit an existing block', () => {
        const editUrl = `blocks/edit-block?blockId=${blockId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/block/${blockId}`).as("apiCall");

        cy.get('[data-cy=blockName]').clear().type('Edited Blocks');
        cy.get('.tox-edit-area__iframe').then(($iframe) => {
            const iframeDoc = $iframe.contents();
            const editorBody = iframeDoc.find('body');
            cy.wrap(editorBody).type('Edited testDescription');
        });

        cy.get('[data-cy=addEditBlockBtn]').click();

        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'blocks')
    });

    it('should cancel and navigate back to the block list', () => {
        cy.get('[data-cy=cancelBlockBtn]').click();
        cy.url().should('include', 'blocks');
    });

})