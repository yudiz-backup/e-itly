import { baseURL, forgot_password_email } from "../../config";

context("Forgot Password flow", () => {
  beforeEach(() => {
    cy.visit(baseURL + "forgot-password");
  });

  it("Should display forgot password form", () => {
    cy.get("[data-cy=forgotEmail]").should("exist");
  });

  it("Should not submit without entering email", () => {
    cy.get("[data-cy=forgotButton]").click();
    cy.get("[data-cy=forgotEmailError]").should("be.visible");
    cy.get("[data-cy=forgotEmailError]").should(
      "contain",
      "Email address is required."
    );
  });

  it("Should not submit without entering wrong email ", () => {
    cy.get("[data-cy=forgotEmail]").type("invalidUser");
    cy.get("[data-cy=forgotButton]").click();
    cy.get("[data-cy=forgotEmailError]").should("be.visible");
    cy.get("[data-cy=forgotEmailError]").should(
      "contain",
      "Email address is not valid."
    );
  });

  it("Should trigger API call when the 'Submit' button is clicked", () => {
    cy.intercept("POST", "api/admin/forget-password").as("apiCall");
    cy.get("[data-cy=forgotEmail]").type(forgot_password_email);
    cy.get("[data-cy=forgotButton]").click();
    cy.wait("@apiCall").should((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });
});
