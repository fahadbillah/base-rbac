import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

import { CustomWorld } from "./world";

// Launch browser once for the entire test run
BeforeAll(async function () {
    // Browser is launched per-scenario via Before hook
});

AfterAll(async function () {
    // Cleanup is handled per-scenario
});

// E2E scenarios: launch browser + new context per scenario for isolation
Before({ tags: "@e2e" }, async function (this: CustomWorld) {
    this.browser = await chromium.launch({
        headless: process.env.HEADLESS !== "false",
    });
    this.context = await this.browser.newContext({
        baseURL: this.baseUrl,
        // Intercept Auth0 in test mode if needed
    });
    this.page = await this.context.newPage();
});

After({ tags: "@e2e" }, async function (this: CustomWorld, scenario) {
    // Capture screenshot on failure
    if (scenario.result?.status === Status.FAILED) {
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, "image/png");
    }
    await this.context?.close();
    await this.browser?.close();
});
