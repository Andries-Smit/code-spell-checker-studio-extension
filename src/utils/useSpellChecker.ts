import { useState, useEffect } from "react";
import type nspell from "nspell";
import { loadDictionary } from "@dictionary";

export function useSpellChecker(language = "en_US"): nspell | null {
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
