import { studioPro, Primitives } from "@mendix/extensions-api";

import { TextData, TextState, TextType } from "../utils/textReducer";
import { Settings } from "./Settings";
import { validateName as validateNameModel } from "./ModelValidation";

const messageBoxApi = studioPro.ui.messageBoxes;

export interface ModuleInfo {
    value: string;
    label: string;
}

export const loadModules = async (): Promise<ModuleInfo[]> => {
    const { domainModels } = studioPro.app.model;
    const allModules = await domainModels.getModules();
    const modules = allModules.map(m => ({ value: m.$ID, label: m.name! }));
    return modules;
};

export const isValidName = (text: TextData, texts: TextData[]): boolean => {
    const message = validateNameModel(text, texts);

    return !message;
};

export const validateName = (text: TextData, texts: TextData[], newText?: string): boolean => {
    const message = validateNameModel(text, texts, newText);
    if (message) {
        messageBoxApi.show("error", message);
    }
    return !message;
};

export const loadModel = async (settings: Settings): Promise<TextData[]> => {
    const { pages, domainModels, enumerations, snippets } = studioPro.app.model;
    const allModules = await domainModels.getModules();
    console.log("modules", allModules);
    const unitsInfo = await domainModels.getUnitsInfo();
    console.log("getUnitsInfo", unitsInfo);
    const moduleSelection = settings.moduleSelection.map(m => m.label);
    const dataSet: TextData[] = [];
    allModules.forEach(module => {
        if (moduleSelection.includes(module.name!)) {
            dataSet.push({
                id: module.$ID,
                location: "Project",
                text: module.name!,
                textOriginal: module.name!,
                type: TextType.module,
                state: TextState.valid,
                edit: false,
                readonly: true,
                show: false,
                update: async (_name: string) => {
                    console.error("Can not update module names");
                },
            });
        }
    });
    if (settings.checkModel) {
        const selectedModels = await domainModels.loadAll((info: Primitives.UnitInfo) =>
            moduleSelection.includes(info.moduleName!),
        );
        selectedModels.forEach(model => {
            const moduleName = unitsInfo.find(m => m.$ID === model.$ID)?.moduleName || "?";
            model.associations.forEach(association => {
                dataSet.push({
                    id: association.$ID,
                    location: moduleName,
                    text: association.name,
                    textOriginal: association.name,
                    type: TextType.association,
                    state: TextState.valid,
                    edit: false,
                    readonly: false,
                    show: false,
                    update: async (name: string) => {
                        association.name = name;
                        await domainModels.save(model);
                    },
                });
            });
            model.entities.forEach(entity => {
                dataSet.push({
                    id: entity.$ID,
                    location: moduleName,
                    text: entity.name,
                    textOriginal: entity.name,
                    type: TextType.entity,
                    state: TextState.valid,
                    edit: false,
                    readonly: false,
                    show: false,
                    update: async (name: string) => {
                        entity.name = name;
                        await domainModels.save(model);
                    },
                });

                entity.attributes.forEach(attribute => {
                    dataSet.push({
                        id: attribute.$ID,
                        location: moduleName + "." + entity.name,
                        text: attribute.name,
                        textOriginal: attribute.name,
                        type: TextType.attribute,
                        state: TextState.valid,
                        edit: false,
                        show: false,
                        readonly: false,
                        update: async (name: string) => {
                            attribute.name = name;
                            await domainModels.save(model);
                        },
                    });
                });
            });
        });
    }
    if (settings.checkSnippets) {
        const selectedSnippets = await snippets.loadAll((info: Primitives.UnitInfo) =>
            moduleSelection.includes(info.moduleName!),
        );
        selectedSnippets.forEach(snippet => {
            const moduleName = unitsInfo.find(m => m.$ID === snippet.$ID)?.moduleName || "?";
            dataSet.push({
                id: snippet.$ID,
                location: moduleName,
                text: snippet.name,
                textOriginal: snippet.name,
                type: TextType.snippet,
                state: TextState.valid,
                edit: false,
                readonly: false,
                show: false,
                update: async (name: string) => {
                    snippet.name = name;
                    snippets.save(snippet);
                },
            });
            snippet.parameters.forEach(parameter => {
                dataSet.push({
                    id: parameter.$ID,
                    location: moduleName + "." + snippet.name,
                    text: parameter.name,
                    textOriginal: parameter.name,
                    type: TextType.snippetParameter,
                    state: TextState.valid,
                    edit: false,
                    readonly: false,
                    show: false,
                    update: async (name: string) => {
                        parameter.name = name;
                        snippets.save(snippet);
                    },
                });
            });
            snippet.variables.forEach(variable => {
                dataSet.push({
                    id: variable.$ID,
                    location: moduleName + "." + snippet.name,
                    text: variable.name,
                    textOriginal: variable.name,
                    type: TextType.snippetVariable,
                    state: TextState.valid,
                    edit: false,
                    readonly: false,
                    show: false,
                    update: async (name: string) => {
                        variable.name = name;
                        await snippets.save(snippet);
                    },
                });
            });
        });
    }
    if (settings.checkEnums) {
        const selectedEnums = await enumerations.loadAll((info: Primitives.UnitInfo) =>
            moduleSelection.includes(info.moduleName!),
        );
        selectedEnums.forEach(enumeration => {
            const moduleName = unitsInfo.find(m => m.$ID === enumeration.$ID)?.moduleName || "?";
            dataSet.push({
                id: enumeration.$ID,
                location: moduleName,
                text: enumeration.name,
                textOriginal: enumeration.name,
                type: TextType.enumeration,
                state: TextState.valid,
                edit: false,
                readonly: false,
                show: false,
                update: async (name: string) => {
                    enumeration.name = name;
                    enumerations.save(enumeration);
                },
            });
            enumeration.values.forEach(value => {
                dataSet.push({
                    id: value.$ID,
                    location: moduleName + "." + enumeration.name,
                    text: value.name,
                    textOriginal: value.name,
                    type: TextType.enumerationValue,
                    state: TextState.valid,
                    edit: false,
                    readonly: true,
                    show: false,
                    update: async (_name: string) => {
                        console.error("Can not update enum value");
                    },
                });
            });
        });
    }
    if (settings.checkPages) {
        const selectedPages = await pages.loadAll((info: Primitives.UnitInfo) =>
            moduleSelection.includes(info.moduleName!),
        );
        selectedPages.forEach(page => {
            // const moduleName =
            //     unitsInfo.find((m) => m.$ID === page.$ID)?.moduleName || "?";
            dataSet.push({
                id: page.$ID,
                location: "?",
                text: page.name,
                textOriginal: page.name,
                type: TextType.page,
                state: TextState.valid,
                edit: false,
                readonly: false,
                show: false,
                update: async (name: string) => {
                    page.name = name;
                    pages.save(page);
                },
            });
            page.variables.forEach(variable => {
                dataSet.push({
                    id: variable.$ID,
                    location: page.name,
                    text: variable.name,
                    textOriginal: variable.name,
                    type: TextType.pageVariable,
                    state: TextState.valid,
                    edit: false,
                    readonly: false,
                    show: false,
                    update: async (name: string) => {
                        variable.name = name;
                        pages.save(page);
                    },
                });
            });
            page.parameters.forEach(parameter => {
                dataSet.push({
                    id: parameter.$ID,
                    location: page.name,
                    text: parameter.name,
                    textOriginal: parameter.name,
                    type: TextType.pageParameter,
                    state: TextState.valid,
                    edit: false,
                    readonly: false,
                    show: false,
                    update: async (name: string) => {
                        parameter.name = name;
                        pages.save(page);
                    },
                });
            });
        });
    }
    console.log(JSON.stringify(dataSet, null, 2));
    return dataSet;
};
