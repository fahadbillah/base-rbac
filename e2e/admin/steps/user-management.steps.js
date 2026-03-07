"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
(0, cucumber_1.Given)("I visit the admin portal", async function () {
    await this.page.goto(this.worldParameters.adminPortalUrl);
});
(0, cucumber_1.Given)("I visit the admin portal at {string}", async function (path) {
    await this.page.goto(`${this.worldParameters.adminPortalUrl}${path}`);
});
(0, cucumber_1.Given)("I am logged in as an admin", async function () {
    // TODO: use Auth0 test tenant + programmatic login
    await this.page.goto(this.worldParameters.adminPortalUrl);
});
(0, cucumber_1.When)("I navigate to {string}", async function (path) {
    await this.page.goto(`${this.worldParameters.adminPortalUrl}${path}`);
});
(0, cucumber_1.Then)("I should see the heading {string}", async function (heading) {
    const h1 = this.page.locator(`h1:has-text("${heading}")`);
    await (0, test_1.expect)(h1).toBeVisible();
});
(0, cucumber_1.Then)("I should see a {string} button", async function (label) {
    const btn = this.page.getByRole("button", { name: label });
    await (0, test_1.expect)(btn).toBeVisible();
});
//# sourceMappingURL=user-management.steps.js.map