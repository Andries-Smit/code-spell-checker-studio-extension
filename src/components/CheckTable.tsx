import { Dispatch, ReactElement, SetStateAction, useCallback, useRef } from "react";
import nspell from "nspell";
import Select from "react-select";
import Spinner from "react-bootstrap/Spinner";

import { saveSettings } from "@settings";
import { ModuleInfo, validateName } from "@model";

import UnderlinedText from "./UnderlineText";
import { Icon } from "./Icon";
import { Settings } from "../utils/Settings";
import { TextData, Action, TextState } from "../utils/textReducer";

interface CheckTableProps {
    settings: Settings;
    setSettings: Dispatch<SetStateAction<Settings>>;
    texts: TextData[];
    dispatch: Dispatch<Action>;
    modules: ModuleInfo[];
    loadData: () => void;
    spell: nspell;
    loading: boolean;
}
export const CheckTable = ({
    settings,
    setSettings,
    texts,
    dispatch,
    modules,
    loadData,
    spell,
    loading,
}: CheckTableProps): ReactElement => {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSettingsChange = useCallback(
        <K extends keyof Settings>(key: K, value: Settings[K]) => {
            setSettings(prev => {
                const updated = { ...prev, [key]: value };
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }
                debounceRef.current = setTimeout(() => {
                    saveSettings(updated);
                }, 500);
                return updated;
            });
        },
        [setSettings],
    );

    const onClickRefresh = (): void => loadData();

    const onClickSave = (id: string): void => {
        const text = texts.find(t => t.id === id);
        if (validateName(text!, texts)) {
            text?.update!(text.text);
            dispatch({ type: "EDIT_TEXT", payload: { id, edit: false } });
        }
    };

    const handleChange = (id: string, newText: string, save: boolean): void => {
        if (!save) {
            dispatch({
                type: "UPDATE_TEXT",
                payload: { id, text: newText, spell },
            });
        } else {
            const text = texts.find(t => t.id === id);
            if (validateName(text!, texts, newText)) {
                text?.update!(text.text);
                dispatch({
                    type: "UPDATE_TEXT",
                    payload: { id, text: newText, spell },
                });
                dispatch({ type: "EDIT_TEXT", payload: { id, edit: false } });
            }
        }
    };

    const onClickIgnore = (id: string, text: string): void => {
        handleSettingsChange("projectIgnoreText", (settings.projectIgnoreText += text + ","));
        handleSettingsChange("projectIgnore", [...settings.projectIgnore, text]);

        dispatch({ type: "IGNORE_TEXT", payload: { id } });
    };

    const addToDictionary = (word: string): void => {
        spell.add(word);
        handleSettingsChange("projectDictionaryText", (settings.projectDictionaryText += word + ","));
        handleSettingsChange("projectDictionary", [...settings.projectDictionary, word]);
        dispatch({
            type: "REFRESH_SPELLCHECK",
            payload: { spell, ignore: settings.projectIgnore },
        });
    };

    const onClickEdit = (id: string, edit: boolean): void => {
        dispatch({ type: "EDIT_TEXT", payload: { id, edit } });
    };

    const filteredTexts = texts.filter(t => t.show);

    return (
        <div>
            <div className="select-wrapper">
                <Select
                    value={settings.moduleSelection}
                    isMulti
                    name="colors"
                    options={modules}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    id="selectedModules"
                    onChange={e => {
                        console.log(e);
                        const moduleSelection = e.map(m => m);
                        handleSettingsChange("moduleSelection", moduleSelection);
                    }}
                />
                <button className="btn btn-primary" onClick={onClickRefresh}>
                    Refresh
                </button>
            </div>
            <hr />

            {loading && (
                <div>
                    <h5>Loading model....</h5>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {!loading && (
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th scope="col">Location</th>
                            <th scope="col">Type</th>
                            <th scope="col">Text</th>
                            <th scope="col"></th>
                            <th scope="col">State</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTexts.map(text => {
                            return (
                                <tr key={text.id}>
                                    <td>{text.location}</td>
                                    <td>
                                        <Icon type={text.type} />
                                    </td>
                                    <td>
                                        {!text.edit && (
                                            <div className="input-group">
                                                <UnderlinedText
                                                    text={text.text}
                                                    underline={text.errorHighlight}
                                                    update={updateText => {
                                                        handleChange(text.id, updateText, true);
                                                    }}
                                                    addToDictionary={addToDictionary}
                                                    readonly={text.readonly}
                                                />
                                            </div>
                                        )}
                                        {text.edit && (
                                            <div className="input-group input-group-inline">
                                                <input
                                                    className="form-control form-control-sm"
                                                    spellCheck="false"
                                                    type="text"
                                                    value={text.text}
                                                    onChange={e => handleChange(text.id, e.target.value, false)}
                                                    onKeyDown={event => {
                                                        if (event.key === "Enter") {
                                                            onClickSave(text.id);
                                                        }
                                                    }}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        onClick={e => onClickSave(text.id)}
                                                        className="btn btn-outline-secondary btn-sm"
                                                        type="button"
                                                    >
                                                        OK
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {!text.edit && (
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                title={text.readonly ? "Readonly" : "Edit"}
                                                disabled={text.readonly}
                                                onClick={() => onClickEdit(text.id, true)}
                                            >
                                                <span className="icon-wrapper icon-btn">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        width="100%"
                                                        height="100%"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                                    </svg>
                                                </span>
                                            </button>
                                        )}
                                        {text.text !== text.textOriginal && (
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                title="Undo"
                                                onClick={() => handleChange(text.id, text.textOriginal, true)}
                                            >
                                                <span className="icon-wrapper icon-btn">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        width="100%"
                                                        height="100%"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z" />
                                                    </svg>
                                                </span>
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {text.state === TextState.valid && (
                                            <span className="icon-wrapper icon-ok" title="OK">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="100%"
                                                    height="100%"
                                                    fill="currentColor"
                                                >
                                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                </svg>
                                            </span>
                                        )}
                                        {text.state === TextState.error && (
                                            <span className="icon-wrapper icon-error" title="Invalid Name">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="100%"
                                                    height="100%"
                                                    fill="currentColor"
                                                >
                                                    <path d="M96 64c0-17.7-14.3-32-32-32S32 46.3 32 64l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32L96 64zM64 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
                                                </svg>
                                            </span>
                                        )}
                                        {text.state === TextState.invalid && (
                                            <span className="icon-wrapper icon-error" title="Spelling Error">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="100%"
                                                    height="100%"
                                                    fill="currentColor"
                                                >
                                                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                                                </svg>
                                            </span>
                                        )}
                                        {text.state === "ignored" && (
                                            <div className="icon-wrapper icon-ignore" title="Ignored">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="100%"
                                                    height="100%"
                                                    fill="currentColor"
                                                >
                                                    <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM152 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {text.state === "invalid" && (
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => onClickIgnore(text.id, text.text)}
                                            >
                                                Ignore
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};
