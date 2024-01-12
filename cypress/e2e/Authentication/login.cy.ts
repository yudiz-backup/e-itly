import { baseURL, testEmail, testPassword } from "../../config";

context("Login flow", () => {
  beforeEach(() => {
    cy.visit(baseURL);
  });
  it("Should display login form", () => {
    cy.get("[data-cy=loginEmail]").should("exist");
    cy.get("[data-cy=loginPassword]").should("exist");
    cy.get("[data-cy=loginButton]").should("exist");
  });

  it("Should have forgot password link", () => {
    cy.get("[data-cy=forgot-password]").should("have.text", "Forgot Password?");
  });

  it("Should have allow user to show and hide password", () => {
    cy.get("[data-cy=loginPassword]")
      .invoke("attr", "type")
      .should("eq", "password");

    cy.get("[data-cy=eyeIcon]").click();

    cy.get("[data-cy=loginPassword]")
      .invoke("attr", "type")
      .should("eq", "text");

    cy.get("[data-cy=eyeIcon]").click();

    cy.get("[data-cy=loginPassword]")
      .invoke("attr", "type")
      .should("eq", "password");
  });
  
  it("Should not login without entering email and password", () => {
    cy.get("[data-cy=loginButton]").click();

    cy.get("[data-cy=loginEmailError]").should("be.visible");
    cy.get("[data-cy=loginEmailError]").should(
      "contain",
      "Email address is required."
    );
    cy.get("[data-cy=loginPasswordError]").should("be.visible");
    cy.get("[data-cy=loginPasswordError]").should(
      "contain",
      "Password is required."
    );
  });

  it("Should not login without entering wrong email and password", () => {
    cy.get("[data-cy=loginEmail]").type("invalidUser");
    cy.get("[data-cy=loginButton]").click();
    cy.get("[data-cy=loginEmailError]").should("be.visible");
    cy.get("[data-cy=loginEmailError]").should(
      "contain",
      "Email address is not valid."
    );
  });

  it("Should be able to login with valid email and password", () => {
    cy.get("[data-cy=loginEmail]")
      .type(testEmail)
      .should("have.value", testEmail);
    cy.get("[data-cy=loginPassword]")
      .type(testPassword)
      .should("have.value", testPassword);
    cy.get("[data-cy=loginButton]").click();
    cy.url().should("include", "/");
  });
});
