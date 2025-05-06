import { studioPro } from "@mendix/extensions-api";
import { ModuleInfo } from "./Model";
import { Language } from "./useSpellChecker";

const settingsLocation = "./settings-code-spell-checker.json";

export interface Settings {
    language: Language;
    projectDictionary: string[];
    projectDictionaryText: string;
    projectIgnore: string[];
    projectIgnoreText: string;
    moduleSelection: ModuleInfo[];
    checkModel: boolean;
    checkPages: boolean;
    checkEnums: boolean;
    checkSnippets: boolean;
    checkShowAll: boolean;
}

export const defaultSettings: Settings = {
    language: Language.en_US,
    projectDictionary: [],
    projectDictionaryText: "",
    projectIgnore: [],
    projectIgnoreText: "",
    moduleSelection: [],
    checkModel: true,
    checkPages: true,
    checkEnums: true,
    checkSnippets: true,
    checkShowAll: true,
};

export const loadSettings = async (): Promise<Settings> => {
    try {
        const settingsText = await studioPro.app.files.getFile(settingsLocation);
        const settings = JSON.parse(settingsText) as Settings;
        console.log(settings);
        return settings;
    } catch (e) {
        console.warn("error loading settings", e);
        console.log("default settings", defaultSettings);
        return defaultSettings;
    }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
    const settingsText = JSON.stringify(settings);
    await studioPro.app.files.putFile(settingsLocation, settingsText);
};
