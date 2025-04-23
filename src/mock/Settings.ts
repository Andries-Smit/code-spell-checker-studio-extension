import { Settings } from "../utils/Settings";

const projectDictionaryText = "Mendix,clevr,haha";
const projectIgnoreText = "blabla,haha";

export const defaultSettings: Settings = {
    language: "en_US",
    projectDictionary: projectDictionaryText.split(","),
    projectDictionaryText,
    projectIgnore: projectIgnoreText.split(","),
    projectIgnoreText,
    moduleSelection: [
        { value: "56ae6b0d-952a-4ea0-9450-a446bzzzzc406abe", label: "Test" },
        { value: "e9c15a45-bfe1-469c-ac92-65a0c17ecd6c", label: "TestB" },
    ],
    checkModel: true,
    checkPages: true,
    checkEnums: true,
    checkSnippets: true,
    checkShowAll: true,
};

export const loadSettings = async (): Promise<Settings> => {
    console.log("mock load settings", defaultSettings);
    return defaultSettings;
};

export const saveSettings = async (settings: Settings): Promise<void> => {
    console.log("mock save settings", settings);
};
