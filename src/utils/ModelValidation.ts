import { TextData } from "../utils/textReducer";

export const validateName = (text: TextData, texts: TextData[], newText?: string): string => {
    const namePattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
    const name = newText ?? text.text;
    let message = "";
    if (texts.find(t => t.text === name && t.type === text.type && t.location === text.location && t.id !== text.id)) {
        message = `The name '${name}' is already in use.`;
    }
    if (name.length === 0) {
        message = "The name cannot be empty.";
    }
    if (!namePattern.test(name)) {
        message = `The name '${name}' is not valid. Names should start with a letter or underscore and can only contain letters, digits and underscores.`;
    }
    if (reservedWords.includes(name)) {
        message = `The name '${name}' is a reserved word.`;
    }
    return message;
};

const reservedWords = [
    "abstract",
    "assert",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "changedby",
    "changeddate",
    "char",
    "class",
    "con",
    "const",
    "context",
    "continue",
    "createddate",
    "currentUser",
    "default",
    "do",
    "double",
    "else",
    "empty",
    "enum",
    "extends",
    "false",
    "final",
    "finally",
    "float",
    "for",
    "goto",
    "guid",
    "id",
    "if",
    "implements",
    "import",
    "instanceof",
    "int",
    "interface",
    "long",
    "MendixObject",
    "native",
    "new",
    "null",
    "object",
    "owner",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "strictfp",
    "submetaobjectname",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "true",
    "try",
    "type",
    "void",
    "volatile",
    "while",
];
