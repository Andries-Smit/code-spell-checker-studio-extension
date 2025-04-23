import { TextData, TextState, TextType } from "../utils/textReducer";
import { Settings } from "../utils/Settings";
import { validateName as validateNameModel } from "../utils/ModelValidation";

export const loadModel = async (settings: Settings): Promise<TextData[]> => {
    const moduleSelection = settings.moduleSelection.map(m => m.label);
    const selected = dataSet.filter(t => moduleSelection.includes(t.location));
    return selected;
};

export const isValidName = (text: TextData, texts: TextData[]): boolean => {
    const message = validateNameModel(text, texts);

    return !message;
};

export const validateName = (text: TextData, texts: TextData[], newText?: string): boolean => {
    const message = validateNameModel(text, texts, newText);
    if (message) {
        alert(message);
    }
    return !message;
};

const update = (name: string): void => {
    console.log("update: " + name);
};

export interface ModuleInfo {
    value: string;
    label: string;
}

export const loadModules = async (): Promise<ModuleInfo[]> => {
    const modules = dataSet.map(m => ({ value: m.id, label: m.location }));

    return modules;
};

const dataSet: TextData[] = [
    {
        id: "56ae6b0d-952a-4ea0-9450-a446bzzzzc406abe",
        location: "Test",
        text: "AttributeNaaame",
        textOriginal: "AttributeNaaame",
        type: TextType.attribute,
        state: TextState.valid,
        update,
        edit: false,
        readonly: false,
        show: false,
    },
    {
        id: "56ae6b0d-952a-4ea0-9450-6bzzzzc406abe",
        location: "Test",
        text: "IAmAnInvalidWord",
        textOriginal: "IAmAnInvalidWord",
        type: TextType.attribute,
        state: TextState.valid,
        update,
        edit: false,
        readonly: false,
        show: false,
    },
    {
        id: "e9c15a45-bfse1-469c-ac92-65a0c17ecd6c",
        location: "TestB",
        text: "Attributee",
        textOriginal: "Attributee",
        type: TextType.enumeration,
        state: TextState.valid,
        update,
        edit: false,
        readonly: false,
        show: false,
    },
    {
        id: "e9c15a45-bfe1-469c-ac92-65a0sc17ecd6c",
        location: "TestB",
        text: "Enum_Value",
        textOriginal: "Enum_Value",
        type: TextType.enumerationValue,
        state: TextState.valid,
        update,
        edit: false,
        readonly: true,
        show: false,
    },
    {
        id: "56ae6b0d-952a-4ea0-9450-sss",
        location: "MyFirstModule",
        text: "Attribbute_Name",
        textOriginal: "Attribbute_Name",
        type: TextType.entity,
        state: TextState.valid,
        update,
        edit: false,
        readonly: false,
        show: false,
    },
    {
        id: "56ae6b0d-952a-ss4ea0-9450-sss",
        location: "BLA",
        text: "IAmAnInvalidWord",
        textOriginal: "IAmAnInvalidWord",
        type: TextType.attribute,
        state: TextState.valid,
        update,
        edit: false,
        readonly: false,
        show: false,
    },
];
