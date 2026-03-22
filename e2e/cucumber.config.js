const path = require("path");

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
        paths: [path.join(__dirname, "../specs/api/**/*.feature")],
        require: [
            path.join(__dirname, "../packages/test-utils/src/world.ts"),
            path.join(__dirname, "../packages/test-utils/src/hooks.ts"),
            path.join(__dirname, "api/steps/**/*.ts"),
            path.join(__dirname, "api/support/**/*.ts"),
        ],
        tags: "@api",
    },

    // ─── Admin E2E Profile ────────────────────────────────────────
    "e2e:admin": {
        ...common,
        paths: [path.join(__dirname, "../specs/admin/**/*.feature")],
        require: [
            path.join(__dirname, "../packages/test-utils/src/world.ts"),
            path.join(__dirname, "../packages/test-utils/src/hooks.ts"),
            path.join(__dirname, "admin/steps/**/*.ts"),
            path.join(__dirname, "admin/support/**/*.ts"),
        ],
        tags: "@e2e and @admin",
    },

    // ─── Member E2E Profile ───────────────────────────────────────
    "e2e:member": {
        ...common,
        paths: [path.join(__dirname, "../specs/member/**/*.feature")],
        require: [
            path.join(__dirname, "../packages/test-utils/src/world.ts"),
            path.join(__dirname, "../packages/test-utils/src/hooks.ts"),
            path.join(__dirname, "member/steps/**/*.ts"),
            path.join(__dirname, "member/support/**/*.ts"),
        ],
        tags: "@e2e and @member",
    },
};

module.exports = config;
