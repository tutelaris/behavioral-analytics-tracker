describe("Javascript tracker", () => {
  it("should work", () => {
    cy.intercept("https://my-analytics-dsn.elastic.co/events", { body: {} }).as(
      "TrackerEvent"
    );

    cy.visit("http://localhost:3000/javascript-tracker");

    cy.wait("@TrackerEvent").then((interception) => {
      expect(JSON.parse(interception.request.body)).to.deep.contains({
        event_type: "pageview",
        event_data: {},
        url: "http://localhost:3000/javascript-tracker",
      });
    });

    cy.get(".click-event").click();
    cy.wait("@TrackerEvent").then((interception) => {
      expect(JSON.parse(interception.request.body)).to.deep.contains({
        event_type: "click",
        event_data: { test: "test" },
      });
    });

    cy.getCookie("EA_VID").should("exist");
  });
});