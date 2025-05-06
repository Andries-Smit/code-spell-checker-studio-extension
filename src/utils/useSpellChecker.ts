import { useState, useEffect } from "react";
import type nspell from "nspell";
import { loadDictionary } from "@dictionary";

export enum Language {
    en_US = "en_US",
    en_GB = "en_GB",
    nl_NL = "nl_NL",
}

export const Languages = [
    {
        language: "English (US)",
        code: Language.en_US,
    },
    {
        language: "English (UK)",
        code: Language.en_GB,
    },
    {
        language: "Dutch",
        code: Language.nl_NL,
    },
];

export function useSpellChecker(language: Language = Language.en_US): nspell | null {
    const [spell, setSpell] = useState<nspell | null>(null);

    useEffect(() => {
        let isMounted = true;

        const load = async (): Promise<void> => {
            try {
                const dictionary = await loadDictionary(language);
                if (isMounted) {
                    setSpell(dictionary);
                }
            } catch (err) {
                console.error(`Failed to load spell checker for ${language}`, err);
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [language]);

    return spell;
}
