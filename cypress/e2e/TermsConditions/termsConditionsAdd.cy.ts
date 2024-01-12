import { baseURL, termsConditionId, testDescription, testTitle } from "../../config";

context("TermsCondition FLow", () => {

    beforeEach(() => {
        cy.visit(baseURL + "terms-conditions/add")
    });

    it("Should have form fields", () => {
        cy.get("[data-cy=title]").should("exist");
        cy.get(".tox-edit-area__iframe").its('0.contentDocument.body')
    });

    it("Should successfully add a new terms & condition", () => {
        cy.intercept("POST", "api/term-condition").as("apiCall");

        cy.get("[data-cy=title]").type(testTitle);
        cy.get('.tox-edit-area__iframe').then(($iframe) => {
            const iframeDoc = $iframe.contents();
            const editorBody = iframeDoc.find('body');
            cy.wrap(editorBody).type(testDescription);
        });

        cy.get("[data-cy=addEditTermsConditionBtn]").click();

        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'terms-conditions')
    });

    it('should edit an existing terms & condition', () => {
        const editUrl = `terms-conditions/edit?termsConditionId=${termsConditionId}`;
        cy.visit(baseURL + editUrl);

        cy.intercept("PUT", `api/term-condition/${termsConditionId}`).as("apiCall");

        cy.get('[data-cy=title]').clear().type('Edited terms & condition');
        cy.get('.tox-edit-area__iframe').then(($iframe) => {
            const iframeDoc = $iframe.contents();
            const editorBody = iframeDoc.find('body');
            cy.wrap(editorBody).type('Edited testDescription');
        });

        cy.get('[data-cy=addEditTermsConditionBtn]').click();

        cy.wait("@apiCall").should((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.url().should('include', 'terms-conditions')
    });

    it('should cancel and navigate back to the terms & condition list', () => {
        cy.get('[data-cy=cancelTermsConditionBtn]').click();
        cy.url().should('include', 'terms-conditions');
    });

})