let originalConsoleMethods = {};

function filterConsoleMessages() {
    // Iterate through all console methods and filter messages
    Object.keys(console).forEach(method => {
        originalConsoleMethods[method] = console[method];

        console[method] = function () {
            const message = arguments[0];
            if (typeof message === "string" && message.includes("%c[")) {
                return;
            }
            originalConsoleMethods[method].apply(console, arguments);
        };
    });
}

function revertConsoleMessages() {
    // Restore original console methods
    Object.keys(originalConsoleMethods).forEach(method => {
        console[method] = originalConsoleMethods[method];
    });
    // Clear the originalConsoleMethods object
    originalConsoleMethods = {};
}

export async function onLoad() {
    filterConsoleMessages();
}

export function onUnload() {
    revertConsoleMessages();
}
