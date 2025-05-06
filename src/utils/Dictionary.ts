import nspell from "nspell";

import { Language } from "./useSpellChecker";

export async function loadDictionary(languageCode: Language = Language.en_US): Promise<nspell> {
    console.log("loadDictionaries: " + languageCode);

    const aff = await fetchFile(`./dictionaries/${languageCode}/index.aff`);
    const dic = await fetchFile(`./dictionaries/${languageCode}/index.dic`);

    return nspell(aff, dic);
}

async function fetchFile(filePath: string): Promise<string> {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Error fetching the file:", error);
    }
    return "";
}
