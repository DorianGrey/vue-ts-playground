// https://docs.cypress.io/api/introduction/api.html
/// <reference types="cypress"/>

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("div.v-toolbar__title", /(Demo App)|(Demo-Anwendung)/);
  });
});