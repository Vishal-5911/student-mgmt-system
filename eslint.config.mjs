import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
    rules: {
      "no-undef": "off", // ❌ Disables undefined variable errors (not recommended)
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
