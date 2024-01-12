import { baseURL, testEmail, testPassword } from "../../config";

context("Reset Password flow", () => {
  beforeEach(() => {
    cy.visit(baseURL + "reset-password?oobCode=value");
    cy.url().then((url) => {
      const currentUrl = url;
      expect(currentUrl.includes("oobCode")).to.be.true;
    });
  });

  it("Should display reset password form", () => {
    cy.get("[data-cy=newResetPass]").should("exist");
    cy.get("[data-cy=confirmResetPass]").should("exist");
    cy.get("[data-cy=resetPasswordButton]").should("exist");
  });

  it("Should have allow user to show and hide new password", () => {
    cy.get("[data-cy=newResetPass]")
      .invoke("attr", "type")
      .should("eq", "password");

    cy.get("[data-cy=eyeIcon]").eq(0).click();

    cy.get("[data-cy=newResetPass]")
      .invoke("attr", "type")
      .should("eq", "text");

    cy.get("[data-cy=eyeIcon]").eq(0).click();

    cy.get("[data-cy=newResetPass]")
      .invoke("attr", "type")
      .should("eq", "password");
  });

  it("Should have allow user to show and hide confirm password", () => {
    cy.get("[data-cy=confirmResetPass]")
      .invoke("attr", "type")
      .should("eq", "password");

    cy.get("[data-cy=eyeIcon]").eq(1).click();

    cy.get("[data-cy=confirmResetPass]")
      .invoke("attr", "type")
      .should("eq", "text");

    cy.get("[data-cy=eyeIcon]").eq(1).click();

    cy.get("[data-cy=confirmResetPass]")
      .invoke("attr", "type")
      .should("eq", "password");
  });

  it("Should not submit without entering password", () => {
    cy.get("[data-cy=resetPasswordButton]").click();
    cy.get("[data-cy=newResetPassError]").should("be.visible");
    cy.get("[data-cy=newResetPassError]").should(
      "contain",
      "Password is required."
    );
    cy.get("[data-cy=confirmResetPassError]").should("be.visible");
    cy.get("[data-cy=confirmResetPassError]").should(
      "contain",
      "Confirm Password is required."
    );
  });


  it("Should not submit without matching passwords", () => {
    cy.get("[data-cy=newResetPass]").type("newPassword");
    cy.get("[data-cy=confirmResetPass]").type("confirmPassword");
    cy.get("[data-cy=resetPasswordButton]").click();
    cy.get("[data-cy=confirmResetPassError]").should("be.visible");
    cy.get("[data-cy=confirmResetPassError]").should(
      "contain",
      "Confirm Password should include atleast one uppercase & one lowecase letter, one number and one special character."
    );
  });
});
