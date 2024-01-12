import { baseURL, testEmail, testPassword } from "../config";

export const loginAsAdmin = () => {
  cy.visit(baseURL);
  cy.get("[data-cy=loginEmail]").type(testEmail);
  cy.get("[data-cy=loginPassword]").type(testPassword);
  cy.get("[data-cy=loginButton]").click();
  cy.wait(10000);
};
