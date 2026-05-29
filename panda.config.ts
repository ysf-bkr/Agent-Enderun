import { defineConfig } from "@pandacss/dev";

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    // Where to look for your css declarations
    include: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./apps/**/*.{js,jsx,ts,tsx}",
        // Project-internal UI components only (no packages/ui by default)
        "./apps/**/src/components/**/*.{ts,tsx}",
        "./apps/**/src/ui/**/*.{ts,tsx}",
    ],

    // Files to exclude
    exclude: [],

    // Conditions for Dark Mode and other states
    conditions: {
        extend: {
            dark: ".dark &, [data-theme='dark'] &",
            light: ".light &, [data-theme='light'] &",
        },
    },

    // Theme Customization
    theme: {
        extend: {
            // Base Tokens (Absolute Values)
            tokens: {
                colors: {
                    brand: {
                        50: { value: "#eef2ff" },
                        100: { value: "#e0e7ff" },
                        200: { value: "#c7d2fe" },
                        300: { value: "#a5b4fc" },
                        400: { value: "#818cf8" },
                        500: { value: "#6366f1" },
                        600: { value: "#4f46e5" },
                        700: { value: "#4338ca" },
                        800: { value: "#3730a3" },
                        900: { value: "#312e81" },
                        950: { value: "#1e1b4b" },
                    },
                },
                spacing: {
                    container: { value: "1200px" },
                },
            },
            // Semantic Tokens (Theme Aware)
            semanticTokens: {
                colors: {
                    bg: {
                        canvas: {
                            value: { base: "{colors.white}", _dark: "{colors.brand.950}" },
                        },
                        surface: {
                            value: { base: "{colors.gray.50}", _dark: "{colors.brand.900}" },
                        },
                        muted: {
                            value: { base: "{colors.gray.100}", _dark: "{colors.brand.800}" },
                        },
                    },
                    text: {
                        default: {
                            value: { base: "{colors.gray.900}", _dark: "{colors.white}" },
                        },
                        muted: {
                            value: { base: "{colors.gray.500}", _dark: "{colors.gray.400}" },
                        },
                        brand: {
                            value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" },
                        },
                    },
                    accent: {
                        default: {
                            value: { base: "{colors.brand.500}", _dark: "{colors.brand.500}" },
                        },
                        emphasis: {
                            value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" },
                        },
                        fg: {
                            value: { base: "{colors.white}", _dark: "{colors.white}" },
                        },
                    },
                    border: {
                        default: {
                            value: { base: "{colors.gray.200}", _dark: "{colors.brand.800}" },
                        },
                    },
                },
            },
        },
    },

    // The output directory for your css system
    outdir: "styled-system",
});
