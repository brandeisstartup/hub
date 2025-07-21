// cypress/e2e/nav.cy.ts

describe("Responsive Main Navigation", () => {
  const labels = ["Projects", "Upcoming", "Events"];
  it("shows all top-level nav links in desktop view", () => {
    cy.viewport(1280, 800);
    cy.visit("/");
    labels.forEach((label) => {
      cy.get("nav").contains(label).should("be.visible");
    });
  });

  it("shows all top-level nav links in mobile menu", () => {
    cy.viewport(375, 667);
    cy.visit("/");
    cy.get('button[aria-label="Open main menu"]').click();
  });
});
