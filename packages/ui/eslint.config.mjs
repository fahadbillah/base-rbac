import baseConfig from "@ai-sdlc/config/eslint/base";

export default [
  ...baseConfig,
  {
    ignores: ["dist/", "node_modules/", "*.js"]
  }
];
