import imgUrlEnumerationValue from "../../assets/EnumerationValue.png?inline";
import imgUrlAssociation from "../../assets/Mendix.Modeler.Theming.Icons.Association.png?inline";
import imgUrlAttribute from "../../assets/Mendix.Modeler.Theming.Icons.Attribute.png?inline";
import imgUrlEntity from "../../assets/Mendix.Modeler.Theming.Icons.Entity.png?inline";
import imgUrlEnumeration from "../../assets/Mendix.Modeler.Theming.Icons.Enumeration.png?inline";
import imgUrlModule from "../../assets/Mendix.Modeler.Theming.Icons.Module.png?inline";
import imgUrlPage from "../../assets/Mendix.Modeler.Theming.Icons.Page.png?inline";
import imgUrlParameter from "../../assets/Mendix.Modeler.Theming.Icons.Parameter.png?inline";
import imgUrlSnippet from "../../assets/Mendix.Modeler.Theming.Icons.Snippet.png?inline";
import imgUrlVariable from "../../assets/Variable.png?inline";

import { TextType } from "../utils/textReducer";
import { ReactElement } from "react";

const getIconUrl = (type: TextType): string => {
    switch (type) {
        case TextType.attribute:
            return imgUrlAttribute;
        case TextType.entity:
            return imgUrlEntity;
        case TextType.association:
            return imgUrlAssociation;
        case TextType.page:
            return imgUrlPage;
        case TextType.pageParameter:
            return imgUrlParameter;
        case TextType.snippet:
            return imgUrlSnippet;
        case TextType.snippetParameter:
            return imgUrlParameter;
        case TextType.enumeration:
            return imgUrlEnumeration;
        case TextType.module:
            return imgUrlModule;
        case TextType.snippetVariable:
            return imgUrlVariable;
        case TextType.pageVariable:
            return imgUrlVariable;
        case TextType.enumerationValue:
            return imgUrlEnumerationValue;

        default:
            console.warn("Unknown type: " + type);
            return "";
    }
};

interface IconProps {
    type: TextType;
}

export const Icon = ({ type }: IconProps): ReactElement => {
    const url = getIconUrl(type);
    if (url === "") {
        return <span>{type}</span>;
    }
    return <img src={url} alt={type} title={type} width="20" height="20" />;
};
