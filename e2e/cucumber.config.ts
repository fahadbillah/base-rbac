import { IConfiguration } from "@cucumber/cucumber/api";

const common: Partial<IConfiguration> = {
    requireModule: ["tsx/esm"],
    format: [
        "progress-bar",
        "json:cucumber-report/results.json",
        "html:cucumber-report/report.html",
    ],
    formatOptions: { snippetInterface: "async-await" },
    worldParameters: {
        adminPortalUrl: process.env.ADMIN_URL ?? "http://localhost:3000",
        memberPortalUrl: process.env.MEMBER_URL ?? "http://localhost:3001",
        apiUrl: process.env.API_URL ?? "http://localhost:4000",
    },
};

const config: Record<string, Partial<IConfiguration>> = {
    default: common,

    // ─── API Profile ──────────────────────────────────────────────
    api: {
        ...common,
        paths: ["specs/api/**/*.feature"],
        require: [
            "packages/test-utils/src/hooks.ts",
            "e2e/api/steps/**/*.ts",
            "e2e/api/support/**/*.ts",
        ],
        tags: "@api",
    },

    // ─── Admin E2E Profile ────────────────────────────────────────
    "e2e:admin": {
        ...common,
        paths: ["specs/admin/**/*.feature"],
        require: [
            "packages/test-utils/src/world.ts",
            "packages/test-utils/src/hooks.ts",
            "e2e/admin/steps/**/*.ts",
            "e2e/admin/support/**/*.ts",
        ],
        tags: "@e2e and @admin",
    },

    // ─── Member E2E Profile ───────────────────────────────────────
    "e2e:member": {
        ...common,
        paths: ["specs/member/**/*.feature"],
        require: [
            "packages/test-utils/src/world.ts",
            "packages/test-utils/src/hooks.ts",
            "e2e/member/steps/**/*.ts",
            "e2e/member/support/**/*.ts",
        ],
        tags: "@e2e and @member",
    },
};

export default config;
