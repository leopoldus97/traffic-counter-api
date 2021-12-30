describe("Authentication Controller", () => {

    let auth = null;
    let sessionHeader = null;
    before(() => {
        cy.exec("npm run seed").then(() => {
            cy.fixture("seed-data").then(data => {
                auth = data.auth
                cy.request({ method: "POST", url: "/authentication/", body: auth }).as('authReq');
                cy.get('@authReq').then(response => sessionHeader = { "x-session-token": response.body.sessionToken });
            });
        })
    });

    it("expect POST with valid credentials to return 200", () => {
        cy.request({ method: "POST", url: "/authentication/", body: auth }).as('authReq');

        cy.get('@authReq').then(response => {
            expect(response.status).to.eq(200);
            expect(Object.keys(response.body).includes("sessionToken")).to.eq(true);
            expect(Object.keys(response.body).includes("sessionExpiryDate")).to.eq(true);
        });
    });

    it("expect POST with invalid credentials to return 409", () => {
        cy.request({ method: "POST", url: "/authentication/", failOnStatusCode: false, body: { username: "huggie", password: "wuggie" } }).as('authReq');

        cy.get('@authReq').then(response => {
            expect(response.status).to.eq(409);
            expect(response.body.error).to.eq("Provided credentials did not match any user");
        });
    });

    it("expect GET to return 200 for authenticated user", () => {
        cy.request({ method: "GET", url: "/authentication/", headers: sessionHeader}).as('authReq');

        cy.get('@authReq').then(response => {
            expect(response.status).to.eq(200);
        });
    });

    it("expect GET to return 403 for unauthenticated user", () => {
        cy.request({ method: "GET", url: "/authentication/", failOnStatusCode: false }).as('authReq');

        cy.get('@authReq').then(response => {
            expect(response.status).to.eq(403);
            expect(response.body.error).to.eq("Forbidden");
        });
    });

    it("expect DELETE to return 200 for authenticated user", () => {
        cy.request({ method: "DELETE", url: "/authentication/", headers: sessionHeader}).as('authReq');

        cy.get('@authReq').then(response => {
            expect(response.status).to.eq(200);
        });
    });

    it("expect DELETE to return 403 for unauthenticated user", () => {
        cy.request({ method: "DELETE", url: "/authentication/", failOnStatusCode: false }).as('authReq');

        cy.get('@authReq').then(response => {
            expect(response.status).to.eq(403);
            expect(response.body.error).to.eq("Forbidden");
        });
    });
});