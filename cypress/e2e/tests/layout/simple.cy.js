// cypress/e2e/layout.cy.ts

const routes = ["/", "/search", "/submissions/project-form"];

describe("Site chrome (nav + footer) is present on every page", () => {
  routes.forEach((path) => {
    context(`Page: ${path}`, () => {
      beforeEach(() => {
        cy.visit(path);
      });

      it("renders the nav", () => {
        cy.get("nav").should("exist").and("be.visible");
      });

      it("renders the footer", () => {
        cy.get("footer").should("exist").and("be.visible");
      });

      it("footer has top-level sections", () => {
        cy.get("footer").within(() => {
          // Check the three column headings
          cy.contains("Entrepreneurship & Collaboration").should("be.visible");
          cy.contains("Contact Us").should("be.visible");
          cy.contains("Connect with us").should("be.visible");
        });
      });

      it("footer has main nav links in first column", () => {
        cy.get("footer").within(() => {
          // Under the Entrepreneurship & Collaboration section
          cy.contains("Entrepreneurship & Collaboration")
            .parent() // container
            .find("ul li a")
            .then(($links) => {
              const texts = [...$links].map((el) => el.textContent?.trim());
              expect(texts).to.include.members([
                "Home",
                "About",
                "Events",
                "Projects"
              ]);
            });
        });
      });

      it("footer has contact info", () => {
        cy.get("footer").within(() => {
          cy.contains("Contact Us")
            .parent()
            .find("ul li")
            .should("contain.text", "Brandeis University")
            .and("contain.text", "pwells@brandeis.edu")
            .and("contain.text", "brandeisstartup@gmail.com");
        });
      });

      it("footer has connect links", () => {
        cy.get("footer").within(() => {
          cy.contains("Connect with us")
            .parent()
            .find("ul li a")
            .then(($links) => {
              const hrefs = [...$links].map((el) => el.getAttribute("href"));
              expect(hrefs).to.include(
                "https://www.youtube.com/@BrandeisStartupHub"
              );
              expect(hrefs).to.include("/");
            });
        });
      });

      it("footer bottom bar has copyright and legal links", () => {
        cy.get("footer").within(() => {
          // The footer has two top‐level divs; the second one is the bottom bar
          cy.get("> div")
            .eq(1)
            .within(() => {
              // 1) Copyright text
              cy.contains(
                new RegExp(
                  `©?\\s*${new Date().getFullYear()} Brandeis Entrepreneurship and Collaboration Hub`
                )
              ).should("be.visible");

              // 2) Exactly three <a> in this bottom bar with these labels
              const expected = [
                "About",
                "Terms of Service",
                "Privacy Statement"
              ];
              cy.get("a")
                .should("have.length", expected.length)
                .each(($link, idx) => {
                  cy.wrap($link).should("contain.text", expected[idx]);
                });
            });
        });
      });
    });
  });
});
