import { defineConfig, loadEnv, UserConfig } from "vite";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({ mode }) => {
    const isMock = mode === "mock";
    const env = loadEnv(mode, process.cwd(), "");

    const projectDir = env.TEST_PROJECT?.trim();
    const outDir = projectDir ? projectDir : "dist/CodeSpellChecker";

    return {
        resolve: {
            alias: {
                // Map `@module` to either mock or utils module
                "@model": isMock
                    ? path.resolve(__dirname, "src/mock/Model.ts")
                    : path.resolve(__dirname, "src/utils/Model.ts"),
                "@settings": isMock
                    ? path.resolve(__dirname, "src/mock/Settings.ts")
                    : path.resolve(__dirname, "src/utils/Settings.ts"),
                "@dictionary": isMock
                    ? path.resolve(__dirname, "src/mock/Dictionary.ts")
                    : path.resolve(__dirname, "src/utils/Dictionary.ts"),
            },
        },
        build: {
            cssCodeSplit: false,
            lib: {
                formats: ["es"],
                entry: {
                    main: "src/main/index.ts",
                    ui: "src/ui/index.tsx",
                },
            },
            rollupOptions: {
                external: [
                    "@mendix/component-framework",
                    "@mendix/model-access-sdk",
                ],
            },
            outDir,
        },
        plugins: [cssInjectedByJsPlugin()],
    } satisfies UserConfig;
});
