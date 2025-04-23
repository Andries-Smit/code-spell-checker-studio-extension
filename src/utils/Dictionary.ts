import nspell from "nspell";
import dic_en_us from "/node_modules/dictionary-en/index.dic?raw";
import aff_en_us from "/node_modules/dictionary-en/index.aff?raw";
import dic_en_gb from "/node_modules/dictionary-en-gb/index.dic?raw";
import aff_en_gb from "/node_modules/dictionary-en-gb/index.aff?raw";
import dic_nl_nl from "/node_modules/dictionary-nl/index.dic?raw";
import aff_nl_nl from "/node_modules/dictionary-nl/index.aff?raw";

export async function loadDictionary(languageCode: string): Promise<nspell> {
    console.log("loadDictionaries: " + languageCode);
    if (languageCode === "en_GB") {
        return nspell(aff_en_gb, dic_en_gb);
    } else if (languageCode === "nl_NL") {
        return nspell(aff_nl_nl, dic_nl_nl);
    }
    // default languageCode = "en_US"
    return nspell(aff_en_us, dic_en_us);
}
