import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

const styleRules = {
    indent: ["error", 4],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-constant-condition": "warn",
};

export default tseslint.config(
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "framework-mcp/dist/**",
            "apps/*/dist/**",
            ".agent/**",
            ".gemini/**",
            ".claude/**",
            ".cursor/**",
            ".enderun/**",
            "panda.config.ts",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
            parserOptions: {
                project: ["./tsconfig.json", "./apps/*/tsconfig.json", "./framework-mcp/tsconfig.json"],
                tsconfigRootDir: import.meta.dirname,
            },

        },
        rules: {
            ...styleRules,
            "no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            ...styleRules,
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        },
    },
);
