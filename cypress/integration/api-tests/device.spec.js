describe("Device Controller", () => {

    let sessionHeader = null;
    let devices = null;
    before(() => {
        cy.exec("npm run seed").then(() => {
            cy.fixture("seed-data").then(data => {
                devices = data.devices.map(d => d.pid).sort();
                cy.request({ method: "POST", url: "/authentication/", body: data.auth }).as('authReq');
                cy.get('@authReq').then(response => sessionHeader = { "x-session-token": response.body.sessionToken });
            });
        })
    });

    it("expect GET All to return device list", () => {
        cy.request({ method: "GET", url: "/device/", headers: sessionHeader }).as("devReq");

        cy.get('@devReq').then(response => {
            expect(response.status).to.eq(200);
            assert(Array.isArray(response.body), "Expect body to be an array");
            expect(response.body.length).to.eq(devices.length);
            expect(response.body.map(d => d.pid).sort().some((pid,idx) => pid !== devices[idx])).to.eq(false);
        });

    });

    it("expect UNAUTH GET to return 403", () => {
        cy.request({ method: "GET", url: "/device/", failOnStatusCode: false }).as("devReq");
        cy.get('@devReq').then(response => expect(response.status).to.eq(403));
    });
})
