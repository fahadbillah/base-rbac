import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

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
    isAuthenticated?: boolean;
    mockRole?: string;
    prisma: PrismaClient;
}

export class CustomWorld extends World implements AppWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    declare worldParameters: WorldParameters;
    lastResponse?: { status: number; body: unknown };
    isAuthenticated?: boolean;
    mockRole?: string;
    private _prisma?: PrismaClient;

    constructor(options: IWorldOptions) {
        super(options);
        this.worldParameters = options.parameters as WorldParameters;
    }

    get prisma(): PrismaClient {
        if (!this._prisma) {
            this._prisma = new PrismaClient();
        }
        return this._prisma;
    }

    get apiUrl(): string {
        return this.worldParameters.apiUrl;
    }

    get baseUrl(): string {
        // Default to admin portal for general e2e
        return this.worldParameters.adminPortalUrl;
    }
}

setWorldConstructor(CustomWorld);
