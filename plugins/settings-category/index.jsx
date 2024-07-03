const {
    settings: {
        registerSection
    }
} = shelter;

const unregisters = [];
export async function onLoad() {
    unregisters.push(registerSection("divider"));
    unregisters.push(registerSection("header", "GoofCord"));
    unregisters.push(registerSection("section", "goofcord", "Settings", () => window.goofcord.openSettingsWindow));
}

export function onUnload() {
    unregisters.forEach(unregister => unregister());
}
