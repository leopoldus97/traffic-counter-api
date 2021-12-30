describe("Settings Controller", () => {
    const pid = "123";
    const mockSetting = {
        pid,
        timestamp: new Date(),
        fps: 30
    };

    let sessionHeader = null;
    before(() => {
        cy.exec("npm run seed").then(() => {
            cy.fixture("seed-data").then(data => {
                cy.request({ method: "POST", url: "/authentication/", body: data.auth }).as('authReq');
                cy.get('@authReq').then(response => sessionHeader = { "x-session-token": response.body.sessionToken });
            });
        })
    });

    // POST
    it("expect UNAUTH POST to return 403", () => {
        cy.request({ method: "POST", url: `/settings/`, failOnStatusCode: false }).as("settingsReq");
        cy.get('@settingsReq').then(response => expect(response.status).to.eq(403));
    });

    it("expect POST with empty body to return 400", () => {
        cy.request({ method: "POST", url: `/settings/`, failOnStatusCode: false, headers: sessionHeader }).as("postReq");
        cy.get('@postReq').then(response => expect(response.status).to.eq(400));
    });

    it("expect POST to return 201", () => {
        cy.request({ method: "POST", url: `/settings/`, body: mockSetting, headers: sessionHeader }).as("postReq");
        cy.get('@postReq').then(response => expect(response.status).to.eq(201));
    });

    // GET
    it("expect GET for existing PID to return correct device settings", () => {
        cy.request({ method: "GET", url: `/settings/${pid}`, headers: sessionHeader }).as("settingsReq");

        cy.get('@settingsReq').then(response => {
            expect(response.status).to.eq(200);
            // TODO
        });
    });

    it("expect GET for not existent PID to return 404", () => {
        cy.request({ method: "GET", url: "/settings/welcome", failOnStatusCode: false, headers: sessionHeader }).as("settingsReq");
        cy.get('@settingsReq').then(response => expect(response.status).to.eq(404));
    });

    it("expect UNAUTH GET to return 403", () => {
        cy.request({ method: "GET", url: `/settings/${pid}`, failOnStatusCode: false }).as("settingsReq");
        cy.get('@settingsReq').then(response => expect(response.status).to.eq(403));
    });

})
