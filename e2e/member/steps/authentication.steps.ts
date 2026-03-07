import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { CustomWorld } from "../../../packages/test-utils/src/world";

Given("I visit the member portal", async function (this: CustomWorld) {
    await this.page.goto(this.worldParameters.memberPortalUrl);
});

Given(
    "I visit the member portal at {string}",
    async function (this: CustomWorld, path: string) {
        await this.page.goto(`${this.worldParameters.memberPortalUrl}${path}`);
    }
);

Given("I am logged in as a member", async function (this: CustomWorld) {
    // TODO: use Auth0 test tenant + programmatic login
    // For now, set a mock auth state via localStorage or a test route
    await this.page.goto(this.worldParameters.memberPortalUrl);
});

When(
    "I navigate to {string}",
    async function (this: CustomWorld, path: string) {
        await this.page.goto(`${this.worldParameters.memberPortalUrl}${path}`);
    }
);

Then(
    "I should see the heading {string}",
    async function (this: CustomWorld, heading: string) {
        const h1 = this.page.locator(`h1:has-text("${heading}")`);
        await expect(h1).toBeVisible();
    }
);

Then(
    "I should see a {string} button",
    async function (this: CustomWorld, label: string) {
        const btn = this.page.getByRole("button", { name: label });
        await expect(btn).toBeVisible();
    }
);

Then(
    "I should be redirected to {string}",
    async function (this: CustomWorld, expectedPath: string) {
        await this.page.waitForURL(`**${expectedPath}`);
        expect(this.page.url()).toContain(expectedPath);
    }
);
