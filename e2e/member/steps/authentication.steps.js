"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
(0, cucumber_1.Given)("I visit the member portal", async function () {
    await this.page.goto(this.worldParameters.memberPortalUrl);
});
(0, cucumber_1.Given)("I visit the member portal at {string}", async function (path) {
    await this.page.goto(`${this.worldParameters.memberPortalUrl}${path}`);
});
(0, cucumber_1.Given)("I am logged in as a member", async function () {
    // TODO: use Auth0 test tenant + programmatic login
    // For now, set a mock auth state via localStorage or a test route
    await this.page.goto(this.worldParameters.memberPortalUrl);
});
(0, cucumber_1.When)("I navigate to {string}", async function (path) {
    await this.page.goto(`${this.worldParameters.memberPortalUrl}${path}`);
});
(0, cucumber_1.Then)("I should see the heading {string}", async function (heading) {
    const h1 = this.page.locator(`h1:has-text("${heading}")`);
    await (0, test_1.expect)(h1).toBeVisible();
});
(0, cucumber_1.Then)("I should see a {string} button", async function (label) {
    const btn = this.page.getByRole("button", { name: label });
    await (0, test_1.expect)(btn).toBeVisible();
});
(0, cucumber_1.Then)("I should be redirected to {string}", async function (expectedPath) {
    await this.page.waitForURL(`**${expectedPath}`);
    (0, test_1.expect)(this.page.url()).toContain(expectedPath);
});
//# sourceMappingURL=authentication.steps.js.map