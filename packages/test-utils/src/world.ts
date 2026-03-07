import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";

export interface WorldParameters {
    adminPortalUrl: string;
    memberPortalUrl: string;
    apiUrl: string;
}

export interface AppWorld extends World {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    worldParameters: WorldParameters;
    lastResponse?: {
        status: number;
        body: unknown;
    };
}

export class CustomWorld extends World implements AppWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    declare worldParameters: WorldParameters;
    lastResponse?: { status: number; body: unknown };

    constructor(options: IWorldOptions) {
        super(options);
        this.worldParameters = options.parameters as WorldParameters;
    }

    get apiUrl(): string {
        return this.parameters.apiUrl;
    }

    get baseUrl(): string {
        // Default to admin portal for general e2e
        return this.parameters.adminPortalUrl;
    }
}

setWorldConstructor(CustomWorld);
