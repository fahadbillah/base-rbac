import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { CustomWorld } from "../../../packages/test-utils/src/world";

Given("I visit the admin portal", async function (this: CustomWorld) {
    await this.page.goto(this.worldParameters.adminPortalUrl);
});

Given(
    "I visit the admin portal at {string}",
    async function (this: CustomWorld, path: string) {
        await this.page.goto(`${this.worldParameters.adminPortalUrl}${path}`);
    }
);

Given("I am logged in as an admin", async function (this: CustomWorld) {
    await this.page.goto(this.worldParameters.adminPortalUrl);
    await this.page.evaluate(() => {
        localStorage.setItem("E2E_MOCK_AUTH", "true");
    });
    await this.page.reload();
});

When(
    "I navigate to {string}",
    async function (this: CustomWorld, path: string) {
        await this.page.goto(`${this.worldParameters.adminPortalUrl}${path}`);
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
