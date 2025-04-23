import nspell from "nspell";
import dic from "/node_modules/dictionary-en/index.dic?raw";
import aff from "/node_modules/dictionary-en/index.aff?raw";

export async function loadDictionary(languageCode: string): Promise<nspell> {
    console.log("loadDictionaries: " + languageCode);
    return nspell(aff, dic);
}
