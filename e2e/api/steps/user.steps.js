"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const supertest_1 = __importDefault(require("supertest"));
const assert_1 = __importDefault(require("assert"));
(0, cucumber_1.Given)("I am authenticated as a member", async function () {
    // TODO: exchange a test user token via Auth0 Management API or use a mock
    this.lastResponse = undefined;
});
(0, cucumber_1.Given)("I am not authenticated", function () {
    this.lastResponse = undefined;
});
(0, cucumber_1.When)("I send a GraphQL query {string}", async function (query) {
    const res = await (0, supertest_1.default)(this.apiUrl)
        .post("")
        .set("Content-Type", "application/json")
        // Token set in Before hook for authenticated scenarios
        .send({ query: `{ ${query} }` });
    this.lastResponse = { status: res.status, body: res.body };
});
(0, cucumber_1.When)("I send a GraphQL mutation {string}", async function (mutation) {
    const res = await (0, supertest_1.default)(this.apiUrl)
        .post("")
        .set("Content-Type", "application/json")
        .send({ query: `mutation { ${mutation} }` });
    this.lastResponse = { status: res.status, body: res.body };
});
(0, cucumber_1.Then)("the response status should be {int}", function (expectedStatus) {
    assert_1.default.equal(this.lastResponse?.status, expectedStatus, `Expected status ${expectedStatus} but got ${this.lastResponse?.status}`);
});
(0, cucumber_1.Then)("the response should contain a user with my email", function () {
    const body = this.lastResponse?.body;
    assert_1.default.ok(body?.data?.me?.email, "Expected user.email in response");
});
(0, cucumber_1.Then)("the response should contain name {string}", function (name) {
    const body = this.lastResponse?.body;
    assert_1.default.equal(body?.data?.updateProfile?.name, name);
});
//# sourceMappingURL=user.steps.js.map