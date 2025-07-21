// cypress/e2e/search.cy.ts

describe("/search page filters", () => {
  beforeEach(() => {
    cy.visit("/search");
  });

  it("renders the filter section and group toggles", () => {
    // Check the overall filter heading
    cy.contains("h2", "Filter Projects").should("be.visible");

    // The group toggles are Disclosure.Buttons (rendered as <button>)
    cy.contains("button", "Competition").should("be.visible");
    cy.contains("button", "Year").should("be.visible");
  });

  it("shows either project cards or the no-results message", () => {
    cy.get("ul.grid").then(($list) => {
      const count = $list.find("li").length;
      if (count > 0) {
        // At least one card exists
        expect(count).to.be.greaterThan(0);
      } else {
        // Or the fallback
        cy.contains("No projects found.").should("be.visible");
      }
    });
  });
});
