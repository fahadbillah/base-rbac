const common = {
    requireModule: ["tsx"],
    format: [
        "progress-bar",
        "json:cucumber-report/results.json",
        "html:cucumber-report/report.html",
    ],
    formatOptions: { snippetInterface: "async-await" },
    worldParameters: {
        adminPortalUrl: process.env.ADMIN_URL ?? "http://127.0.0.1:3000",
        memberPortalUrl: process.env.MEMBER_URL ?? "http://127.0.0.1:3001",
        apiUrl: process.env.API_URL ?? "http://127.0.0.1:4000",
    },
};

const config = {
    default: common,

    // ─── API Profile ──────────────────────────────────────────────
    api: {
        ...common,
        paths: ["../specs/api/**/*.feature"],
        require: [
            "../packages/test-utils/src/world.ts",
            "../packages/test-utils/src/hooks.ts",
            "api/steps/**/*.ts",
            "api/support/**/*.ts",
        ],
        tags: "@api",
    },

    // ─── Admin E2E Profile ────────────────────────────────────────
    "e2e:admin": {
        ...common,
        paths: ["../specs/admin/**/*.feature"],
        require: [
            "../packages/test-utils/src/world.ts",
            "../packages/test-utils/src/hooks.ts",
            "admin/steps/**/*.ts",
            "admin/support/**/*.ts",
        ],
        tags: "@e2e and @admin",
    },

    // ─── Member E2E Profile ───────────────────────────────────────
    "e2e:member": {
        ...common,
        paths: ["../specs/member/**/*.feature"],
        require: [
            "../packages/test-utils/src/world.ts",
            "../packages/test-utils/src/hooks.ts",
            "member/steps/**/*.ts",
            "member/support/**/*.ts",
        ],
        tags: "@e2e and @member",
    },
};

module.exports = config;
