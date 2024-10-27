const settingsStateName = ""

export type SettingsState = {
    yourName: string,
}

export const defaultSettings: SettingsState = {
    yourName: "You",
}

function isSettingsState(obj: unknown): obj is SettingsState {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    const castObj = obj as SettingsState;
    return typeof castObj.yourName === "string";
}

function loadSettings() {
    const settingsString = localStorage.getItem(settingsStateName);
    if (settingsString === null) {
        return defaultSettings;
    } else {
        var savedJSON: unknown = JSON.parse(settingsString);
        if (isSettingsState(savedJSON)) {
            return savedJSON;
        } else {
            console.error("Settings JSON was not in the expected format", savedJSON);
            return defaultSettings;
        }
    }
}

var currentSettings: SettingsState = loadSettings();

export function getSettings(): SettingsState {
    return currentSettings;
}

export function updateSettings(newSettings: SettingsState ) {
    currentSettings = newSettings;
    localStorage.setItem(settingsStateName, JSON.stringify(currentSettings));
}