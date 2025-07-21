// cypress/e2e/home.cy.ts

describe("Home page static content", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows the about heading", () => {
    cy.contains(
      "What is the Brandeis Entrepreneurship and Collaboration Hub?"
    ).should("be.visible");
  });

  it("shows the about paragraph with key phrases", () => {
    // Check a snippet from the start
    cy.contains(
      "Here, students can collaborate on innovative projects, building skills that will serve them in their careers and beyond."
    ).should("be.visible");

    // Check that Philippe Wells is mentioned
    cy.contains("Philippe Wells").should("be.visible");

    // Check that Brandeis International Business School is mentioned
    cy.contains("Brandeis International Business School").should("be.visible");
  });
});
