const {
    settings: {
        registerSection
    }
} = shelter;

const unregisters = [];
export async function onLoad() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    unregisters.push(registerSection("divider"));
    unregisters.push(registerSection("header", "GoofCord"));
    unregisters.push(registerSection("button", "goofcord", "Settings", ()=>{window.goofcord.openSettingsWindow()}));
}

export function onUnload() {
    unregisters.forEach(unregister => unregister());
}
