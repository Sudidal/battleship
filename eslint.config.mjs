/* eslint-disable */

import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import babelParser from "@babel/eslint-parser";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: globals.browser,
      parser: babelParser,
    },
  },

  {
    rules: {
      "no-console": "off",
    },
  },

  ...compat.extends("airbnb-base"),
  eslintConfigPrettier,
];
