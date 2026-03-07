import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "./src/schema.graphql",
    generates: {
        "./src/generated/types.ts": {
            plugins: ["typescript"],
            config: {
                strictScalars: true,
                enumsAsTypes: true,
            },
        },
    },
};

export default config;
