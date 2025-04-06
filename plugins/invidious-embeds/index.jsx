import { updateFastestInstance } from "./instanceTester.jsx";
import {observeForNestedElement} from "../../util/utils.js";

// Destructure Shelter APIs
const {
    plugin: { store },
    observeDom,
    util: { getFiber, reactFiberWalker },
    ui: { Header, HeaderTags, injectCss, TextBox, Button, SwitchItem }, // Assuming injectCss exists or use the provided utility
} = shelter;

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";
const YOUTUBE_THUMBNAIL_URL = "https://i.ytimg.com/vi/";
const INVIDIOUS_EMBED_CLASS = "invidious-embed";
const INVIDIOUS_THUMBNAIL_CLASS = "invidious-thumbnail";
const INVIDIOUS_WRAPPER_CLASS = "invidious-wrapper";
const INVIDIOUS_PLAYBUTTON_CLASS = "invidious-playbutton";
const PROCESSED_MARKER_ATTR = "data-invidious-processed";

const INSTANCE_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

async function maybeUpdateInstance() {
    if (!store.autoupdate && store.lastInstanceUpdateTimestamp > 0) return;

    const now = Date.now();
    const lastUpdate = store.lastInstanceUpdateTimestamp ?? 0;
    const needsUpdate = !store.instance || (now - lastUpdate > INSTANCE_UPDATE_INTERVAL);

    if (needsUpdate) {
        try {
            console.log("Updating Invidious instance...");
            store.instance = await updateFastestInstance();
            store.lastInstanceUpdateTimestamp = now;
            console.log("Invidious instance updated:", store.instance);
        } catch (error) {
            console.error("Failed to update Invidious instance:", error);
        }
    }
}

function createAndInsertInvidiousEmbed(messageElement, videoId) {
    const embedUrl = `${store.instance}/embed/${videoId}?autoplay=1&player_style=youtube&local=true`;
    const thumbnailUrl = `${YOUTUBE_THUMBNAIL_URL}${videoId}/hqdefault.jpg`;

    const iframe = (
        <iframe
            className={INVIDIOUS_EMBED_CLASS}
            src={embedUrl}
            allow="fullscreen"
            loading="lazy"
        />
    );

    let previewElement;

    // Function to replace the original preview with the invidious iframe
    function showIframe() {
        if (previewElement && previewElement.parentElement) {
            previewElement.insertAdjacentElement("beforebegin", iframe);
            previewElement.remove();
            previewElement = null;
        }
    }

    // Create Preview Thumbnail
    previewElement = (
        <div className={`${INVIDIOUS_THUMBNAIL_CLASS} ${INVIDIOUS_EMBED_CLASS}`}>
            <div onClick={showIframe} className={INVIDIOUS_WRAPPER_CLASS}>
                <svg className={INVIDIOUS_PLAYBUTTON_CLASS} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="white" d="M9.25 3.35C7.87 2.45 6 3.38 6 4.96v14.08c0 1.58 1.87 2.5 3.25 1.61l10.85-7.04a1.9 1.9 0 0 0 0-3.22L9.25 3.35Z" />
                </svg>
            </div>
        </div>
    );
    previewElement.style.backgroundImage = `url(${thumbnailUrl})`;

    // Insert the preview after the original message element
    messageElement.insertAdjacentElement("afterend", previewElement);

    messageElement.style.display = "none";
}

function processMessageElement(element) {
    element.parentElement.getElementsByClassName(INVIDIOUS_THUMBNAIL_CLASS).item(0)?.remove();
    if (element.hasAttribute(PROCESSED_MARKER_ATTR)) return;
    element.setAttribute(PROCESSED_MARKER_ATTR, "true");

    try {
        const fiber = getFiber(element);
        const embed = reactFiberWalker(fiber, "embed", true)?.memoizedProps?.embed;

        if (!embed?.url || typeof embed.url !== 'string' || !embed.url.startsWith(YOUTUBE_BASE_URL)) {
            return; // Not a processable YouTube embed
        }

        const videoId = embed.url.substring(YOUTUBE_BASE_URL.length);
        if (!videoId) {
            console.warn("Could not extract video ID from:", embed.url);
            return;
        }

        createAndInsertInvidiousEmbed(element, videoId);
    } catch (error) {
        console.error("Error processing message element for Invidious embed:", error, element);
    }
}

let styleCallback;
let unobserve = () => {};

export async function onLoad() {
    if (window["goofcord"] && window.goofcord.getConfig("invidiousEmbeds") === false) return;

    await maybeUpdateInstance();

    if (!store.instance) {
        console.warn("No Invidious instance configured or found. Embed replacement disabled.");
        return;
    }

    if (styleCallback) {
        styleCallback(style);
    } else {
        styleCallback = injectCss(style);
    }

    unobserve = observeForNestedElement('[data-list-id="chat-messages"]', `article:not([${PROCESSED_MARKER_ATTR}])`, processMessageElement);
}

export function onUnload() {
    unobserve();
    styleCallback();
    styleCallback = undefined;
}

export const settings = () => (
    <>
        <Header tag={HeaderTags.H3}>Invidious Instance</Header>
        <TextBox
            placeholder="invidious.example.com"
            value={store.instance ?? ""}
            onInput={(v) => (store.instance = v?.trim() ? v.trim() : undefined)}
        />
        {<br></br>}
        {<br></br>}
        <SwitchItem
            value={store.autoupdate ?? true}
            onChange={(v) => (store.autoupdate = v)}
        >Auto-update instance?</SwitchItem>
        <Button
            grow={true}
            onClick={async () => { store.lastInstanceUpdateTimestamp = 0; await maybeUpdateInstance(); }}
            style={{
                position: 'relative', left: '50%',
                transform: 'translate(-50%, 0%)'
            }}
        >Update Instance Now</Button>
        {store.lastInstanceUpdateTimestamp && (
            <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                Instance last checked/updated: {new Date(store.lastInstanceUpdateTimestamp).toLocaleString()}
            </p>
        )}
    </>
);

const style = `
    .${INVIDIOUS_EMBED_CLASS} {
        /* Shared styles for iframe and thumbnail */
        display: block;
        border: none;
        width: 100%;
        max-width: 500px;
        aspect-ratio: 16 / 9;
        border-radius: 4px;
        background-color: #000;
        overflow: hidden;
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .${INVIDIOUS_THUMBNAIL_CLASS} {
        display: flex;
        align-items: center;
        justify-content: center;
        background-position: center;
        background-size: cover;
        position: relative;
    }

    .${INVIDIOUS_WRAPPER_CLASS} {
        /* Centered play button container */
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: hsla(0, 0%, 0%, 0.6);
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;
    }
    .${INVIDIOUS_WRAPPER_CLASS}:hover {
         background-color: hsla(0, 0%, 0%, 0.8);
    }


    .${INVIDIOUS_PLAYBUTTON_CLASS} {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease-in-out;
        opacity: 0.9;
    }

    .${INVIDIOUS_WRAPPER_CLASS}:hover .${INVIDIOUS_PLAYBUTTON_CLASS} {
       transform: scale(1.1);
       opacity: 1;
    }
`;