// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginPromise from "eslint-plugin-promise";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat["jsx-runtime"],
    reactHooks.configs["recommended-latest"],
    pluginPromise.configs["flat/recommended"],
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        plugins: {
            reactPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: "tsconfig.json",
                ecmaVersion: 2018,
                sourceType: "module",
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "arrow-body-style": "off",
            "linebreak-style": ["error", "unix"],
            "no-unused-vars": [
                "warn",
                {
                    varsIgnorePattern: "createElement",
                    args: "none",
                },
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    varsIgnorePattern: "createElement",
                    args: "none",
                },
            ],
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/camelcase": "off",
            "@typescript-eslint/class-name-casing": "off",
            "@typescript-eslint/indent": "off",
            "@typescript-eslint/no-object-literal-type-assertion": "off",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-var-requires": "warn",
            "@typescript-eslint/explicit-function-return-type": [
                "warn",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            "@typescript-eslint/array-type": [
                "error",
                { default: "array-simple" },
            ],
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "no-public",
                    overrides: { parameterProperties: "explicit" },
                },
            ],
            "@typescript-eslint/member-ordering": [
                "error",
                {
                    default: [
                        "static-field",
                        "instance-field",
                        "constructor",
                        "instance-method",
                        "static-method",
                    ],
                },
            ],
            "@typescript-eslint/no-empty-interface": [
                "error",
                { allowSingleExtends: true },
            ],
            "@typescript-eslint/no-extraneous-class": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-parameter-properties": "off",
            "@typescript-eslint/no-this-alias": "error",
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/unified-signatures": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",

            "react/display-name": "off",
            "react/prop-types": "off",
            "react/no-access-state-in-setstate": "error",
            "react/no-did-mount-set-state": "error",
            "react/no-find-dom-node": "off",
            "react/no-will-update-set-state": "error",
            "react/jsx-boolean-value": ["error", "never"],
            "react/no-deprecated": "warn",
            "react/jsx-uses-vars": "error",
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",

            "array-callback-return": "error",
            curly: "error",
            "dot-notation": "error",
            eqeqeq: ["error", "allow-null"],
            "guard-for-in": "error",
            "new-parens": "error",

            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",

            "no-async-promise-executor": "error",
            "no-bitwise": "error",
            "no-caller": "error",
            "no-case-declarations": "off",
            "no-dupe-class-members": "off",
            "no-duplicate-imports": "error",
            "no-extra-bind": "error",
            "no-implied-eval": "error",
            "no-loop-func": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-return-await": "error",
            "no-sequences": "error",
            "no-template-curly-in-string": "error",
            "no-throw-literal": "error",
            "no-unmodified-loop-condition": "error",
            "no-unneeded-ternary": "error",
            "no-unused-expressions": "error",
            "no-useless-call": "error",
            "no-useless-catch": "error",
            "no-useless-computed-key": "error",
            "no-useless-return": "error",
            "no-undef": "warn",
            "no-undef-init": "error",
            "no-var": "error",
            "no-void": "error",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "prefer-arrow-callback": "error",
            "prefer-const": "error",
            "prefer-object-spread": "error",
            "prefer-promise-reject-errors": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            radix: "error",
            "react-hooks/rules-of-hooks": "warn",
            "spaced-comment": "error",
        },
        settings: {
            react: {
                createClass: "createReactClass",
                pragma: "createElement",
                version: "detect",
            },
        },
    },
);
