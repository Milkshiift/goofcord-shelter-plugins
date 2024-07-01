const {
    http,
    flux,
    ui: {
        injectCss,
        tooltip
    },
    plugin: {
        store
    },
    observeDom
} = shelter;

const encryptionMark = window.goofcord.getConfig("encryptionMark");
const meEnabled = window.goofcord.getConfig("messageEncryption");

export async function onLoad() {
    if (!meEnabled) return;
    handleEncryption();
    handleDecryption();
    handleTextareaButton();
}

let uninterceptHttp1;
let uninterceptHttp2;
function handleEncryption() {
    uninterceptHttp1 = http.intercept("post", /\/channels\/\d+\/messages/, (req, send) => {
        if (!store.enabled) return send(req);
        req.body.content = window.goofcord.encryptMessage(req.body.content);
        return send(req);
    });
    uninterceptHttp2 = http.intercept("patch", /\/channels\/\d+\/messages/, (req, send) => {
        if (!store.enabled) return send(req);
        req.body.content = window.goofcord.encryptMessage(req.body.content);
        return send(req);
    });
}

let uninterceptFlux;
function handleDecryption() {
    uninterceptFlux = flux.intercept((dispatch) => {
        switch (dispatch.type) {
            case "MESSAGE_CREATE":
                dispatch.message.content = window.goofcord.decryptMessage(dispatch.message.content);
                break;
            case "MESSAGE_UPDATE":
                dispatch.message.content = window.goofcord.decryptMessage(dispatch.message.content);
                break;
            case "MESSAGE_START_EDIT":
                dispatch.content = removePrefix(dispatch.content, encryptionMark);
                break;
            case "LOAD_MESSAGES_SUCCESS":
                for (const message of dispatch.messages) {
                    message.content = window.goofcord.decryptMessage(message.content);
                }
                break;
        }
    });
}

const lockSvg = (
    <div className="encryptContainer2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
    </svg>
    </div>
)
const unlockSvg = (
    <div className="encryptContainer2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M352 192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H288V144C288 64.47 352.5 0 432 0C511.5 0 576 64.47 576 144V192C576 209.7 561.7 224 544 224C526.3 224 512 209.7 512 192V144C512 99.82 476.2 64 432 64C387.8 64 352 99.82 352 144V192z"/>
    </svg>
    </div>
)
const css = `
    .encryptContainer {
      display: flex;
      align-items: center;
    }
    
    .encryptContainer svg path {
      fill: var(--interactive-normal) !important;
    }
    
    .encryptContainer2 {
        padding: 4px;
        margin-left: 4px;
        margin-right: 4px;
    }
    
    .encryptContainer.notActive svg path {
      fill: var(--status-danger) !important;
    }
    
    .encryptContainer svg {
      width: 21px;
      height: 21px;
      cursor: pointer;
    }
`
let unobserve;
async function handleTextareaButton() {
    injectOrUpdateCSS(css, "message-encryption-css");
    unobserve = observeDom('[class^="channelTextArea"] [class^="buttons"]', (node) => {
        if (document.querySelector('#encrypt-icon')) return

        const [enabled, setEnabled] = shelter.solid.createSignal(!!store.enabled)

        const toggleEnabled = () => {
            store.enabled = !enabled()
            setEnabled(!enabled())
        }

        const encryptIcon = (
            <div
                id="encrypt-icon"
                className={`encryptContainer${enabled() ? "" : " notActive"}`}
                style={(node.childElementCount === 0 && { display: "none" })}
                onClick={toggleEnabled}
                onContextMenu={window.goofcord.cycleThroughPasswords}
                use:tooltip={enabled() ? "Encryption active" : "Encryption not active"}
            >
                {enabled() ? lockSvg : unlockSvg}
            </div>
        )

        node.prepend(encryptIcon)
    })
}

export function onUnload() {
    if (!meEnabled) return;
    uninterceptFlux();
    uninterceptHttp1();
    uninterceptHttp2();
    unobserve();
}

function removePrefix(str, prefix) {
    if (str.startsWith(prefix)) {
        return str.substring(prefix.length);
    }
    return str;
}

function injectOrUpdateCSS(css, id) {
    const element = document.getElementById(id);
    if (!element) {
        const style = document.createElement("style");
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
    } else {
        element.textContent = css;
    }
}
