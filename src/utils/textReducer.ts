/* eslint no-unused-vars: 0 */

import { isValidName } from "@model";
import nspell from "nspell";

export enum TextState {
    valid = "valid",
    invalid = "invalid",
    ignored = "ignored",
    error = "error",
}

export enum TextType {
    attribute = "Attribute",
    association = "Association",
    entity = "Entity",
    page = "Page",
    snippet = "Snippet",
    snippetVariable = "Snippet Variable",
    enumeration = "Enumeration",
    module = "Module",
    snippetParameter = "Snippet Parameter",
    enumerationValue = "Enumeration Value",
    pageVariable = "Page Variable",
    pageParameter = "Page Parameter",
}

export interface TextData {
    id: string;
    location: string;
    text: string;
    textOriginal: string;
    words?: string;
    errorHighlight?: Array<[number, number, string[]]>;
    type: TextType;
    suggest?: string[];
    state: TextState;
    edit: boolean;
    readonly: boolean;
    show: boolean;
    update?: (name: string) => void;
}

export type Action =
    | { type: "SET_TEXTS"; payload: TextData[] }
    | {
          type: "UPDATE_TEXT";
          payload: { id: string; text: string; spell: nspell };
      }
    | { type: "IGNORE_TEXT"; payload: { id: string } }
    | { type: "EDIT_TEXT"; payload: { id: string; edit: boolean } }
    | {
          type: "RELOAD_SPELLCHECK";
          payload: { spell: nspell; all: boolean; ignore: string[] };
      }
    | {
          type: "REFRESH_SPELLCHECK";
          payload: { spell: nspell; ignore: string[] };
      };

export const textsReducer = (state: TextData[], action: Action): TextData[] => {
    switch (action.type) {
        case "SET_TEXTS":
            return action.payload;

        case "UPDATE_TEXT":
            return state.map(item => {
                if (item.id === action.payload.id) {
                    const updated = { ...item, text: action.payload.text };
                    const valid = isValidName(updated, state);
                    if (valid) {
                        checkSpellingText(updated, action.payload.spell);
                    } else {
                        updated.state = TextState.error;
                    }
                    return updated;
                }
                return item;
            });

        case "IGNORE_TEXT":
            return state.map(item =>
                item.id === action.payload.id ? { ...item, state: TextState.ignored, errorHighlight: [] } : item,
            );

        case "EDIT_TEXT":
            return state.map(item => (item.id === action.payload.id ? { ...item, edit: action.payload.edit } : item));

        case "RELOAD_SPELLCHECK":
            return state.map(item => {
                const updated = { ...item };
                if (action.payload.ignore.includes(updated.text)) {
                    updated.state = TextState.ignored;
                    updated.errorHighlight = [];
                } else {
                    checkSpellingText(updated, action.payload.spell);
                }
                updated.show = action.payload.all || updated.state === TextState.invalid;
                return updated;
            });

        case "REFRESH_SPELLCHECK":
            return state.map(item => {
                const updated = { ...item };
                if (action.payload.ignore.includes(updated.text)) {
                    updated.state = TextState.ignored;
                    updated.errorHighlight = [];
                } else {
                    checkSpellingText(updated, action.payload.spell);
                }
                return updated;
            });

        default:
            return state;
    }
};

export function checkSpellingText(text: TextData, spell: nspell): void {
    const errorHighlight: Array<[number, number, string[]]> = [];
    const words = splitWordWithPositions(text.text);

    words.forEach(({ word, start, end }) => {
        if (!spell.correct(word)) {
            const suggestions = spell.suggest(word);
            suggestions.push(`Add '${word}' to dictionary`);
            errorHighlight.push([start, end, suggestions]);
        }
    });
    text.words = words.map(w => w.word).join(" ");
    text.state = errorHighlight.length === 0 ? TextState.valid : TextState.invalid;
    text.errorHighlight = errorHighlight;
}

interface WordPart {
    word: string;
    start: number;
    end: number;
}

/**
 * Splits a string into “word parts” by:
 * 1. Splitting on underscores, digits, whitespace, or dots.
 * 2. Further splitting any camelCase or PascalCase fragments.
 * Alternative implement https://github.com/streetsidesoftware/cspell/blob/main/packages/cspell-lib/src/lib/util/wordSplitter.ts
 *
 * Non‐letter parts (including numbers) are discarded.
 */
function splitWordWithPositions(original: string): WordPart[] {
    const words: WordPart[] = [];

    // Delimiter regex: match one or more underscores, digits, whitespace, or dots.
    const delimRegex = /[_\d\s.]+/g;

    let lastIndex = 0;
    let m: RegExpExecArray | null;

    // Camel-case splitting regex:
    //   - [A-Z]+(?=[A-Z][a-z]) : captures an acronym that is followed by a capital letter then a lowercase letter.
    //   - [A-Z]?[a-z]+        : captures an optional starting capital and following lowercase letters.
    const camelRegex = /([A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+)/g;

    // Loop over each delimiter match to isolate segments that contain letters.
    while ((m = delimRegex.exec(original)) !== null) {
        if (m.index > lastIndex) {
            const segment = original.slice(lastIndex, m.index);
            // Use camelRegex on each segment.
            let cm: RegExpExecArray | null;
            while ((cm = camelRegex.exec(segment)) !== null) {
                const token = cm[0];
                const start = lastIndex + cm.index;
                const end = start + token.length;
                words.push({ word: token, start, end });
            }
        }
        // Update lastIndex to after the delimiter.
        lastIndex = m.index + m[0].length;
    }

    // Process any trailing segment after the last delimiter.
    if (lastIndex < original.length) {
        const segment = original.slice(lastIndex);
        let cm: RegExpExecArray | null;
        while ((cm = camelRegex.exec(segment)) !== null) {
            const token = cm[0];
            const start = lastIndex + cm.index;
            const end = start + token.length;
            words.push({ word: token, start, end });
        }
    }

    return words;
}
