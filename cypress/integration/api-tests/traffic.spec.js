describe("Traffic Controller", () => {

    let startDate = null;
    let endDate = null;
    let sessionHeader = null;
    before(() => {
        cy.exec("npm run seed").then(() => {
            cy.fixture("seed-data").then(data => {
                startDate = new Date(Date.parse(data.traffic.start));
                endDate = new Date(Date.parse(data.traffic.end));
                cy.request({ method: "POST", url: "/authentication/", body: data.auth }).as('authReq');
                cy.get('@authReq').then(response => sessionHeader = { "x-session-token": response.body.sessionToken });
            });
        })
    });

    // GET

    it("expect GET for certain type to return list of traffic records only with the type", () => {
        cy.request({ method: "GET", url: `/traffic?type=car&day=0`, headers: sessionHeader }).as("trafficReq");

        cy.get('@trafficReq').then(response => {
            expect(response.status).to.eq(200);
            assert(Array.isArray(response.body), "Expect body to be an array");
            expect(response.body.find(tr => tr.trafficType !== "car")).to.eq(undefined);
        });

    });

    it("expect GET for all types to return list of traffic records with all types", () => {
        cy.request({ method: "GET", url: `/traffic?day=0`, headers: sessionHeader }).as("trafficReq");

        cy.get('@trafficReq').then(response => {
            expect(response.status).to.eq(200);
            assert(Array.isArray(response.body), "Expect body to be an array");
            expect(
                response.body.some(tr => tr.trafficType === "car") &&
                response.body.some(tr => tr.trafficType === "bicycle") &&
                response.body.some(tr => tr.trafficType === "pedestrian") &&
                response.body.some(tr => tr.trafficType === "motorcycle")
            ).to.eq(true);
        });

    });

    it("expect GET for certain day to return list of traffic records only within that day", () => {
        cy.request({ method: "GET", url: `/traffic?day=${startDate.getTime()}`, headers: sessionHeader }).as("trafficReq");

        cy.get('@trafficReq').then(response => {
            const selectedDate = new Date(startDate);
            selectedDate.setHours(0, 0, 0, 0);
            expect(response.status).to.eq(200);
            assert(Array.isArray(response.body), "Expect body to be an array");
            expect(response.body
                .map(tr => {
                    const d = new Date(Date.parse(tr.timestamp));
                    d.setHours(0, 0, 0, 0);
                    return d;
                })
                .find(d => d.getTime() !== selectedDate.getTime()))
                .to.eq(undefined)
        });

    });

    it("expect GET for all days to return list of traffic records from all days", () => {
        cy.request({ method: "GET", url: `/traffic?day=0`, headers: sessionHeader }).as("trafficReq");

        cy.get('@trafficReq').then(response => {
            // Setup boundaries
            const first = new Date(startDate);
            first.setHours(0, 0, 0, 0);
            const lastDay = new Date(endDate);
            lastDay.setHours(0, 0, 0, 0);

            expect(response.status).to.eq(200);
            assert(Array.isArray(response.body), "Expect body to be an array");
            const asDates = response.body.map(tr => {
                const d = new Date(Date.parse(tr.timestamp))
                d.setHours(0, 0, 0, 0);
                return d;
            });
            expect(asDates.some(d => d < startDate || d > endDate)).to.eq(false);
        });

    });

    it("expect GET for not existent type to return 400", () => {
        cy.request({ method: "GET", url: "/traffic?type=boat", failOnStatusCode: false, headers: sessionHeader }).as("trafficReq");
        cy.get('@trafficReq').then(response => expect(response.status).to.eq(400));

    });

    it("expect UNAUTH GET to return 403", () => {
        cy.request({ method: "GET", url: "/traffic?type=car&day=0", failOnStatusCode: false }).as("trafficReq");
        cy.get('@trafficReq').then(response => expect(response.status).to.eq(403));
    });

    // POST
    it("expect UNAUTH POST to return 403", () => {
        cy.request({ method: "POST", url: `/traffic/`, failOnStatusCode: false }).as("trafficReq");
        cy.get('@trafficReq').then(response => expect(response.status).to.eq(403));
    });

    it("expect POST with empty body to return 400", () => {
        cy.request({ method: "POST", url: `/traffic/`, failOnStatusCode: false, headers: sessionHeader }).as("postReq");
        cy.get('@postReq').then(response => expect(response.status).to.eq(400));

    });

    it("expect POST to return 201", () => {
        cy.request({
            method: "POST", url: `/traffic/`, body: {
                pid: "123",
                timestamp: new Date(),
                trafficType: "car"
            }, headers: sessionHeader
        }).as("postReq");
        cy.get('@postReq').then(response => expect(response.status).to.eq(201));
    });
})
