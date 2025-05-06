import nspell from "nspell";
import dic from "/node_modules/dictionary-en/index.dic?raw";
import aff from "/node_modules/dictionary-en/index.aff?raw";
import { Language } from "../utils/useSpellChecker";

export async function loadDictionary(languageCode: Language): Promise<nspell> {
    console.log("loadDictionaries: " + languageCode);
    return nspell(aff, dic);
}
