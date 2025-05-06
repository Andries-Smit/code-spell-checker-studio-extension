import { ReactElement, Dispatch, SetStateAction, useCallback, useRef } from "react";
import Form from "react-bootstrap/Form";

import { saveSettings } from "@settings";
import { Settings } from "../utils/Settings";
import { Language, Languages } from "../utils/useSpellChecker";

interface SettingsFormProps {
    settings: Settings;
    setSettings: Dispatch<SetStateAction<Settings>>;
}

export const SettingsForm = ({ settings, setSettings }: SettingsFormProps): ReactElement => {
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

    const onChangeProjectIgnore = (value: string): void => {
        handleSettingsChange("projectIgnoreText", value);
        const projectIgnore = value
            .split(/[,\s\n]+/) // split by comma, space, or newline (1 or more)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        handleSettingsChange("projectIgnore", projectIgnore);
    };
    const onChangeProjectDictionary = (value: string): void => {
        handleSettingsChange("projectDictionaryText", value);
        const projectDictionary = value
            .split(/[,\s\n]+/) // split by comma, space, or newline (1 or more)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        handleSettingsChange("projectDictionary", projectDictionary);
    };

    return (
        <div>
            <div className="form-group">
                <label htmlFor="language">Language</label>
                <Form.Select
                    id="language"
                    onChange={e => handleSettingsChange("language", e.target.value as unknown as Language)}
                >
                    {Languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.language}
                        </option>
                    ))}
                </Form.Select>
            </div>
            <div className="form-group">
                <label htmlFor="projectDictionaryText">Project Dictionary</label>
                <textarea
                    className="form-control"
                    id="projectDictionaryText"
                    rows={3}
                    onChange={e => onChangeProjectDictionary(e.target.value)}
                    value={settings.projectDictionaryText}
                />
                <div id="projectDictionaryTextHelpBlock" className="form-text">
                    List of ignored words that are accepted in the dictionary. Separated by comma, spaces or newlines.
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="projectIgnoreText">Project Ignore</label>
                <textarea
                    className="form-control"
                    id="projectIgnoreText"
                    rows={3}
                    onChange={e => onChangeProjectIgnore(e.target.value)}
                    value={settings.projectIgnoreText}
                />
                <div id="projectIgnoreTextHelpBlock" className="form-text">
                    List of ignored document names. Separated by comma, spaces or newlines.
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title">Check Types</h6>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.checkModel}
                            id="checkModel"
                            onChange={e => handleSettingsChange("checkModel", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkModel">
                            Model
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.checkPages}
                            id="checkPages"
                            onChange={e => handleSettingsChange("checkPages", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkPages">
                            Pages
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.checkEnums}
                            id="checkEnums"
                            onChange={e => handleSettingsChange("checkEnums", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkEnums">
                            Enumerations
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.checkSnippets}
                            id="checkSnippets"
                            onChange={e => handleSettingsChange("checkSnippets", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkSnippets">
                            Snippets
                        </label>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h6 className="card-title">Debug</h6>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.checkShowAll}
                            id="checkShowAll"
                            onChange={e => handleSettingsChange("checkShowAll", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="checkShowAll">
                            Show all, including correct words.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
