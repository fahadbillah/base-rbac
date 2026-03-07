/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
    ],
    plugins: ["@typescript-eslint", "import"],
    parser: "@typescript-eslint/parser",
    rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    ["parent", "sibling"],
                    "index",
                ],
                "newlines-between": "always",
                alphabetize: { order: "asc" },
            },
        ],
    },
    ignorePatterns: ["dist/", "node_modules/", "*.js"],
};
