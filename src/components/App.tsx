import { ReactElement, useState, useEffect, useReducer } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { loadModules, loadModel, ModuleInfo } from "@model";
import { loadSettings, defaultSettings } from "@settings";

import { SettingsForm } from "./SettingsForm";
import { CheckTable } from "./CheckTable";
import { Settings } from "../utils/Settings";
import { textsReducer } from "../utils/textReducer";
import { useSpellChecker } from "../utils/useSpellChecker";

import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App(): ReactElement {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [modules, setModules] = useState<ModuleInfo[]>([]);
    const [texts, dispatch] = useReducer(textsReducer, []);
    const spell = useSpellChecker(settings.language);

    const loadData = async (): Promise<void> => {
        console.log("loadData");
        setLoading(true);
        const modules = await loadModules();
        setModules(modules);
        const dataSet = await loadModel(settings);
        dispatch({ type: "SET_TEXTS", payload: dataSet });
        if (spell) {
            dispatch({
                type: "RELOAD_SPELLCHECK",
                payload: { spell, all: settings.checkShowAll, ignore: settings.projectIgnore },
            });
        }
        // console.log(JSON.stringify(dataSet, null, 2));

        setLoading(false);
    };

    const readSettings = async (): Promise<void> => {
        console.log("readSettings");
        setLoading(true);
        setSettings(await loadSettings());
        setLoading(false);
        // await loadData();
    };

    useEffect(() => {
        console.log("refresh spelling?");
        if (spell) {
            settings.projectDictionary.forEach(word => spell.add(word));
            dispatch({
                type: "REFRESH_SPELLCHECK",
                payload: { spell, ignore: settings.projectIgnore },
            });
        }
    }, [spell, settings.projectDictionary, settings.projectIgnore]);

    useEffect(() => {
        console.log("Extension App started!");
        readSettings();
    }, []);

    return (
        <div className="tab-panel">
            <h2>Code Spell Checker</h2>
            <div className="">
                <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="home" title="Checker">
                        {spell && (
                            <CheckTable
                                setSettings={setSettings}
                                settings={settings}
                                spell={spell}
                                texts={texts}
                                dispatch={dispatch}
                                modules={modules}
                                loadData={loadData}
                                loading={loading}
                            />
                        )}
                        {!spell && <div>Loading dictionary...</div>}
                    </Tab>
                    <Tab eventKey="settings" title="Settings">
                        <SettingsForm settings={settings} setSettings={setSettings} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default App;
