// To be clear, this has been converted to a Shelter plugin by AI
// I don't have nearly enough interest in this to make a proper implementation myself

// Original code from: https://github.com/ImNotIcon/undiscord/blob/master/deleteDiscordMessages.user.js

const {
    util: { log: shelterLog },
    flux, // Will use flux.stores, flux.awaitStore
    http,
    plugin, // For plugin.scoped for auto-cleanup
} = shelter;

const USER_SCRIPT_VERSION = "5.2.3";
const HOME = 'https://github.com/victornpb/undiscord';
const WIKI = 'https://github.com/victornpb/undiscord/wiki';
const USER_SCRIPT_PREFIX = '[UNDISCORD]';

// CSS strings
const themeCss = (`
/* undiscord window */
#undiscord.browser { box-shadow: var(--elevation-stroke), var(--elevation-high); overflow: hidden; }
#undiscord.container,
#undiscord .container { background-color: var(--background-secondary); border-radius: 8px; box-sizing: border-box; cursor: default; flex-direction: column; }
#undiscord .header { background-color: var(--background-tertiary); height: 48px; align-items: center; min-height: 48px; padding: 0 16px; display: flex; color: var(--header-secondary); cursor: grab; }
#undiscord .header .icon { color: var(--interactive-normal); margin-right: 8px; flex-shrink: 0; width: 24; height: 24; }
#undiscord .header .icon:hover { color: var(--interactive-hover); }
#undiscord .header h3 { font-size: 16px; line-height: 20px; font-weight: 500; font-family: var(--font-display); color: var(--header-primary); flex-shrink: 0; margin-right: 16px; }
#undiscord .spacer { flex-grow: 1; }
#undiscord .header .vert-divider { width: 1px; height: 24px; background-color: var(--background-modifier-accent); margin-right: 16px; flex-shrink: 0; }
#undiscord legend,
#undiscord label { color: var(--header-secondary); font-size: 12px; line-height: 16px; font-weight: 500; text-transform: uppercase; cursor: default; font-family: var(--font-display); margin-bottom: 8px; }
#undiscord .multiInput { display: flex; align-items: center; font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--text-normal); background-color: var(--input-background); border: none; transition: border-color 0.2s ease-in-out 0s; }
#undiscord .multiInput :first-child { flex-grow: 1; }
#undiscord .multiInput button:last-child { margin-right: 4px; }
#undiscord .input { font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--text-normal); background-color: var(--input-background); border: none; transition: border-color 0.2s ease-in-out 0s; padding: 10px; height: 40px; }
#undiscord fieldset { margin-top: 16px; }
#undiscord .input-wrapper { display: flex; align-items: center; font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--text-normal); background-color: var(--input-background); border: none; transition: border-color 0.2s ease-in-out 0s; }
#undiscord input[type="text"],
#undiscord input[type="search"],
#undiscord input[type="password"],
#undiscord input[type="datetime-local"],
#undiscord input[type="number"],
#undiscord input[type="range"] { font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--text-normal); background-color: var(--input-background); border: none; transition: border-color 0.2s ease-in-out 0s; padding: 10px; height: 40px; }
#undiscord .divider,
#undiscord hr { border: none; margin-bottom: 24px; padding-bottom: 4px; border-bottom: 1px solid var(--background-modifier-accent); }
#undiscord .sectionDescription { margin-bottom: 16px; color: var(--header-secondary); font-size: 14px; line-height: 20px; font-weight: 400; }
#undiscord a { color: var(--text-link); text-decoration: none; }
#undiscord .btn,
#undiscord button { position: relative; display: flex; -webkit-box-pack: center; justify-content: center; -webkit-box-align: center; align-items: center; box-sizing: border-box; background: none; border: none; border-radius: 3px; font-size: 14px; font-weight: 500; line-height: 16px; padding: 2px 16px; user-select: none; /* sizeSmall */     width: 60px; height: 32px; min-width: 60px; min-height: 32px; /* lookFilled colorPrimary */     color: rgb(255, 255, 255); background-color: var(--button-secondary-background); }
#undiscord .sizeMedium { width: 96px; height: 38px; min-width: 96px; min-height: 38px; }
#undiscord .sizeMedium.icon { width: 38px; min-width: 38px; }
#undiscord sup { vertical-align: top; }
/* lookFilled colorPrimary */
#undiscord .accent { background-color: var(--brand-experiment); }
#undiscord .danger { background-color: var(--button-danger-background); }
#undiscord .positive { background-color: var(--button-positive-background); }
#undiscord .info { font-size: 12px; line-height: 16px; padding: 8px 10px; color: var(--text-muted); }
/* Scrollbar */
#undiscord .scroll::-webkit-scrollbar { width: 8px; height: 8px; }
#undiscord .scroll::-webkit-scrollbar-corner { background-color: transparent; }
#undiscord .scroll::-webkit-scrollbar-thumb { background-clip: padding-box; border: 2px solid transparent; border-radius: 4px; background-color: var(--scrollbar-thin-thumb); min-height: 40px; }
#undiscord .scroll::-webkit-scrollbar-track { border-color: var(--scrollbar-thin-track); background-color: var(--scrollbar-thin-track); border: 2px solid var(--scrollbar-thin-track); }
/* fade scrollbar */
#undiscord .scroll::-webkit-scrollbar-thumb,
#undiscord .scroll::-webkit-scrollbar-track { visibility: hidden; }
#undiscord .scroll:hover::-webkit-scrollbar-thumb,
#undiscord .scroll:hover::-webkit-scrollbar-track { visibility: visible; }
/**** functional classes ****/
#undiscord.redact .priv { display: none !important; }
#undiscord.redact x:not(:active) { color: transparent !important; background-color: var(--primary-700) !important; cursor: default; user-select: none; }
#undiscord.redact x:hover { position: relative; }
#undiscord.redact x:hover::after { content: "Redacted information (Streamer mode: ON)"; position: absolute; display: inline-block; top: -32px; left: -20px; padding: 4px; width: 150px; font-size: 8pt; text-align: center; white-space: pre-wrap; background-color: var(--background-floating); -webkit-box-shadow: var(--elevation-high); box-shadow: var(--elevation-high); color: var(--text-normal); border-radius: 5px; pointer-events: none; }
#undiscord.redact [priv] { -webkit-text-security: disc !important; }
#undiscord :disabled { display: none; }
/**** layout and utility classes ****/
#undiscord,
#undiscord * { box-sizing: border-box; }
#undiscord .col { display: flex; flex-direction: column; }
#undiscord .row { display: flex; flex-direction: row; align-items: center; }
#undiscord .mb1 { margin-bottom: 8px; }
#undiscord .log { margin-bottom: 0.25em; }
#undiscord .log-debug { color: inherit; }
#undiscord .log-info { color: #00b0f4; }
#undiscord .log-verb { color: #72767d; }
#undiscord .log-warn { color: #faa61a; }
#undiscord .log-error { color: #f04747; }
#undiscord .log-success { color: #43b581; }
`);

const mainCss = (`
/**** Undiscord Button ****/
#undicord-btn { position: relative; width: auto; height: 24px; margin: 0 8px; cursor: pointer; color: var(--interactive-normal); flex: 0 0 auto; }
#undicord-btn progress { position: absolute; top: 23px; left: -4px; width: 32px; height: 12px; display: none; }
#undicord-btn.running { color: var(--button-danger-background) !important; }
#undicord-btn.running progress { display: block; }
/**** Undiscord Interface ****/
#undiscord { position: fixed; z-index: 10000; /* Ensure high z-index */ top: 58px; right: 10px; display: flex; flex-direction: column; width: 800px; height: 80vh; min-width: 610px; max-width: 100vw; min-height: 448px; max-height: 100vh; color: var(--text-normal); border-radius: 4px; background-color: var(--background-secondary); box-shadow: var(--elevation-stroke), var(--elevation-high); will-change: top, left, width, height; }
#undiscord .header .icon { cursor: pointer; }
#undiscord .window-body { height: calc(100% - 48px); }
#undiscord .sidebar { overflow: hidden scroll; overflow-y: auto; width: 270px; min-width: 250px; height: 100%; max-height: 100%; padding: 8px; background: var(--background-secondary); }
#undiscord .sidebar legend,
#undiscord .sidebar label { display: block; width: 100%; }
#undiscord .main { display: flex; max-width: calc(100% - 250px); background-color: var(--background-primary); flex-grow: 1; }
#undiscord.hide-sidebar .sidebar { display: none; }
#undiscord.hide-sidebar .main { max-width: 100%; }
#undiscord #logArea { font-family: Consolas, Liberation Mono, Menlo, Courier, monospace; font-size: 0.75rem; overflow: auto; padding: 10px; user-select: text; flex-grow: 1; flex-grow: 1; cursor: auto; }
#undiscord .tbar { padding: 8px; background-color: var(--background-secondary-alt); }
#undiscord .tbar button { margin-right: 4px; margin-bottom: 4px; }
#undiscord .footer { cursor: se-resize; padding-right: 30px; }
#undiscord .footer #progressPercent { padding: 0 1em; font-size: small; color: var(--interactive-muted); flex-grow: 1; }
.resize-handle { position: absolute; bottom: -15px; right: -15px; width: 30px; height: 30px; transform: rotate(-45deg); background: repeating-linear-gradient(0, var(--background-modifier-accent), var(--background-modifier-accent) 1px, transparent 2px, transparent 4px); cursor: nwse-resize; }
/**** Elements ****/
#undiscord summary { font-size: 16px; font-weight: 500; line-height: 20px; position: relative; overflow: hidden; margin-bottom: 2px; padding: 6px 10px; cursor: pointer; white-space: nowrap; text-overflow: ellipsis; color: var(--interactive-normal); border-radius: 4px; flex-shrink: 0; }
#undiscord fieldset { padding-left: 8px; }
#undiscord legend a { float: right; text-transform: initial; }
#undiscord progress { height: 8px; margin-top: 4px; flex-grow: 1; }
#undiscord .importJson { display: flex; flex-direction: row; }
#undiscord .importJson button { margin-left: 5px; width: fit-content; }
`);

const dragCss = (`
[name^="grab-"] { position: absolute; --size: 6px; --corner-size: 16px; --offset: -1px; z-index: 9; }
[name^="grab-"]:hover{ background: rgba(128,128,128,0.1); }
[name="grab-t"] { top: 0px; left: var(--corner-size); right: var(--corner-size); height: var(--size); margin-top: var(--offset); cursor: ns-resize; }
[name="grab-r"] { top: var(--corner-size); bottom: var(--corner-size); right: 0px; width: var(--size); margin-right: var(--offset); 
  cursor: ew-resize; }
[name="grab-b"] { bottom: 0px; left: var(--corner-size); right: var(--corner-size); height: var(--size); margin-bottom: var(--offset); cursor: ns-resize; }
[name="grab-l"] { top: var(--corner-size); bottom: var(--corner-size); left: 0px; width: var(--size); margin-left: var(--offset); cursor: ew-resize; }
[name="grab-tl"] { top: 0px; left: 0px; width: var(--corner-size); height: var(--corner-size); margin-top: var(--offset); margin-left: var(--offset); cursor: nwse-resize; }
[name="grab-tr"] { top: 0px; right: 0px; width: var(--corner-size); height: var(--corner-size); margin-top: var(--offset); margin-right: var(--offset); cursor: nesw-resize; }
[name="grab-br"] { bottom: 0px; right: 0px; width: var(--corner-size); height: var(--corner-size); margin-bottom: var(--offset); margin-right: var(--offset); cursor: nwse-resize; }
[name="grab-bl"] { bottom: 0px; left: 0px; width: var(--corner-size); height: var(--corner-size); margin-bottom: var(--offset); margin-left: var(--offset); cursor: nesw-resize; }
`);

const buttonHtml = (`
<div id="undicord-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages with Undiscord">
    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
        <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
    </svg>
    <progress></progress>
</div>
`);

const undiscordTemplate = (`
<div id="undiscord" class="browser container redact" style="display:none;">
    <div class="header">
        <svg class="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
            <path fill="currentColor"
                d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z">
            </path>
        </svg>
        <h3>Undiscord</h3>
        <div class="vert-divider"></div>
        <span> Bulk delete messages</span>
        <div class="spacer"></div>
        <div id="hide" class="icon" aria-label="Close" role="button" tabindex="0">
            <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z">
                </path>
            </svg>
        </div>
    </div>
    <div class="window-body" style="display: flex; flex-direction: row;">
        <div class="sidebar scroll">
            <details open>
                <summary>General</summary>
                <fieldset>
                    <legend>
                        Author ID
                        <a href="{{WIKI}}/authorId" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="multiInput">
                        <div class="input-wrapper">
                            <input class="input" id="authorId" type="text" priv>
                        </div>
                        <button id="getAuthor">me</button>
                    </div>
                </fieldset>
                <hr>
                <fieldset>
                    <legend>
                        Server ID
                        <a href="{{WIKI}}/guildId" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="multiInput">
                        <div class="input-wrapper">
                            <input class="input" id="guildId" type="text" priv>
                        </div>
                        <button id="getGuild">current</button>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        Channel ID
                        <a href="{{WIKI}}/channelId" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="multiInput mb1">
                        <div class="input-wrapper">
                            <input class="input" id="channelId" type="text" priv>
                        </div>
                        <button id="getChannel">current</button>
                    </div>
                    <div class="sectionDescription">
                        <label class="row"><input id="includeNsfw" type="checkbox">This is a NSFW channel</label>
                    </div>
                </fieldset>
            </details>
            <details>
                <summary>Wipe Archive</summary>
                <fieldset>
                    <legend>
                        Import index.json
                        <a href="{{WIKI}}/importJson" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="input-wrapper">
                        <input type="file" id="importJsonInput" accept="application/json,.json" style="width:100%";>
                    </div>
                    <div class="sectionDescription">
                        <br>
                        After requesting your data from discord, you can import it here.<br>
                        Select the "messages/index.json" file from the discord archive.
                    </div>
                    <div class="sectionDescription">
                        <label><input id="includeServers" type="checkbox">Include servers</label>
                    </div>
                </fieldset>
            </details>
            <hr>
            <details>
                <summary>Filter</summary>
                <fieldset>
                    <legend>
                        Search
                        <a href="{{WIKI}}/filters" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="input-wrapper">
                        <input id="search" type="text" placeholder="Containing text" priv>
                    </div>
                    <div class="sectionDescription">
                        Only delete messages that contain the text
                    </div>
                    <div class="sectionDescription">
                        <label><input id="hasLink" type="checkbox">has: link</label>
                    </div>
                    <div class="sectionDescription">
                        <label><input id="hasFile" type="checkbox">has: file</label>
                    </div>
                    <div class="sectionDescription">
                        <label><input id="includePinned" type="checkbox" checked>Include pinned</label>
                    </div>
                </fieldset>
                <hr>
                <fieldset>
                    <legend>
                        Pattern
                        <a href="{{WIKI}}/pattern" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="sectionDescription">
                        Delete messages that match the regular expression
                    </div>
                    <div class="input-wrapper">
                        <span class="info">/</span>
                        <input id="pattern" type="text" placeholder="regular expression" priv>
                        <span class="info">/</span>
                    </div>
                </fieldset>
            </details>
            <details>
                <summary>Messages interval</summary>
                <fieldset>
                    <legend>
                        Interval of messages
                        <a href="{{WIKI}}/messageId" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="multiInput mb1">
                        <div class="input-wrapper">
                            <input id="minId" type="text" placeholder="After a message" priv>
                        </div>
                        <button id="pickMessageAfter">Pick</button>
                    </div>
                    <div class="multiInput">
                        <div class="input-wrapper">
                            <input id="maxId" type="text" placeholder="Before a message" priv>
                        </div>
                        <button id="pickMessageBefore">Pick</button>
                    </div>
                    <div class="sectionDescription">
                        Specify an interval to delete messages.
                    </div>
                </fieldset>
            </details>
            <details>
                <summary>Date interval</summary>
                <fieldset>
                    <legend>
                        After date
                        <a href="{{WIKI}}/dateRange" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="input-wrapper mb1">
                        <input id="minDate" type="datetime-local" title="Messages posted AFTER this date">
                    </div>
                    <legend>
                        Before date
                        <a href="{{WIKI}}/dateRange" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="input-wrapper">
                        <input id="maxDate" type="datetime-local" title="Messages posted BEFORE this date">
                    </div>
                    <div class="sectionDescription">
                        Delete messages that were posted between the two dates.
                    </div>
                    <div class="sectionDescription">
                        * Filtering by date doesn't work if you use the "Messages interval".
                    </div>
                </fieldset>
            </details>
            <hr>
            <details>
                <summary>Advanced settings</summary>
                <fieldset>
                    <legend>
                        Search delay
                        <a href="{{WIKI}}/delay" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="input-wrapper">
                        <input id="searchDelay" type="range" value="1400" step="100" min="100" max="60000">
                        <div id="searchDelayValue"></div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        Delete delay
                        <a href="{{WIKI}}/delay" title="Help" target="_blank" rel="noopener noreferrer">help</a>
                    </legend>
                    <div class="input-wrapper">
                        <input id="deleteDelay" type="range" value="1400" step="50" min="50" max="10000">
                        <div id="deleteDelayValue"></div>
                    </div>
                    <br>
                    <div class="sectionDescription">
                        This will affect the speed in which the messages are deleted.
                        Use the help link for more information.
                    </div>
                </fieldset>
                <label><input id="rateLimitPrevention" type="checkbox" checked>Rate limit prevention</label>
                <!-- Authorization Token Section Removed -->
            </details>
            <hr>
            <div></div>
            <div class="info">
                Undiscord {{VERSION}}
                <br> victornpb
            </div>
        </div>
        <div class="main col">
            <div class="tbar col">
                <div class="row">
                    <button id="toggleSidebar" class="sizeMedium icon">☰</button>
                    <button id="start" class="sizeMedium danger" style="width: 150px;" title="Start the deletion process">▶︎ Delete</button>
                    <button id="stop" class="sizeMedium" title="Stop the deletion process" disabled>🛑 Stop</button>
                    <button id="clear" class="sizeMedium">Clear log</button>
                    <label class="row" title="Hide sensitive information on your screen for taking screenshots">
                        <input id="redact" type="checkbox" checked> Streamer mode
                    </label>
                </div>
                <div class="row">
                    <progress id="progressBar" style="display:none;"></progress>
                </div>
            </div>
            <pre id="logArea" class="logarea scroll">
                <div class="" style="background: var(--background-mentioned); padding: .5em;">Notice: Undiscord may be working slower than usual and<wbr>require multiple attempts due to a recent Discord update.<br>We're working on a fix, and we thank you for your patience.</div>
                <center>
                    <div>Star <a href="{{HOME}}" target="_blank" rel="noopener noreferrer">this project</a> on GitHub!</div>
                    <div><a href="{{HOME}}/discussions" target="_blank" rel="noopener noreferrer">Issues or help</a></div>
                </center>
            </pre>
            <div class="tbar footer row">
                <div id="progressPercent"></div>
                <span class="spacer"></span>
                <label>
                    <input id="trimLog" type="checkbox" checked> Trim log
                </label>
                <label>
                    <input id="autoScroll" type="checkbox" checked> Auto scroll
                </label>
                <div class="resize-handle"></div>
            </div>
        </div>
    </div>
</div>
`);


// --- Plugin's internal logger (adapted from userscript) ---
let undiscordInternalLogFn;
const setUndiscordInternalLogFn = (fn) => undiscordInternalLogFn = fn;

const undiscordInternalLog = {
    debug() { return undiscordInternalLogFn ? undiscordInternalLogFn('debug', arguments) : console.debug.apply(console, arguments); },
    info() { return undiscordInternalLogFn ? undiscordInternalLogFn('info', arguments) : console.info.apply(console, arguments); },
    verb() { return undiscordInternalLogFn ? undiscordInternalLogFn('verb', arguments) : console.log.apply(console, arguments); },
    warn() { return undiscordInternalLogFn ? undiscordInternalLogFn('warn', arguments) : console.warn.apply(console, arguments); },
    error() { return undiscordInternalLogFn ? undiscordInternalLogFn('error', arguments) : console.error.apply(console, arguments); },
    success() { return undiscordInternalLogFn ? undiscordInternalLogFn('success', arguments) : console.info.apply(console, arguments); },
};


// --- Web Worker ---
let workerUrlInstance; // To store the blob URL for cleanup
const workerScript = `
  self.addEventListener('message', function(e) {
    const ms = e.data;
    setTimeout(() => {
      self.postMessage('done');
    }, ms);
  });
`;

function initializeWorker() {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    workerUrlInstance = URL.createObjectURL(blob);
}
function cleanupWorker() {
    if (workerUrlInstance) {
        URL.revokeObjectURL(workerUrlInstance);
        workerUrlInstance = null;
    }
}

// --- Helper functions (largely unchanged, ensure they use `undiscordInternalLog` if they log) ---
const wait = ms => {
    return new Promise((resolve, reject) => {
        if (!workerUrlInstance) {
            undiscordInternalLog.error("Worker not initialized for wait function!");
            // Fallback to simple setTimeout if worker isn't ready, though this blocks main thread for sync-like behavior.
            // For async wait, setTimeout directly is fine. The worker tries to ensure more accurate timing.
            setTimeout(resolve, ms);
            return;
        }
        const worker = new Worker(workerUrlInstance);
        let start = Date.now();
        worker.postMessage(ms);
        worker.addEventListener('message', function(e) {
            if (e.data === 'done') {
                let delay = Date.now() - start - ms;
                if(delay > 100) undiscordInternalLog.warn(`This action was delayed ${delay}ms more than it should've, make sure you don't have too many tabs open!`);
                resolve();
                worker.terminate();
            }
        });
        worker.addEventListener('error', (err) => {
            undiscordInternalLog.error("Error in wait worker:", err);
            reject(err);
            worker.terminate();
        });
    });
};
const msToHMS = s => `${s / 3.6e6 | 0}h ${(s % 3.6e6) / 6e4 | 0}m ${(s % 6e4) / 1000 | 0}s`;
const escapeHTML = html => String(html).replace(/[&<"']/g, m => ({ '&': '&amp;', '<': '&lt;', '"': '&quot;', '\'': '&#039;' })[m]);
const redact = str => `<x>${escapeHTML(str)}</x>`;
const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10)); // window.confirm is fine
const toSnowflake = (date) => /:/.test(date) ? ((new Date(date).getTime() - 1420070400000) * Math.pow(2, 22)) : date;
const replaceInterpolations = (str, obj, removeMissing = false) => str.replace(/\{\{([\w_]+)\}\}/g, (m, key) => obj[key] || (removeMissing ? '' : m));

class UndiscordCore {
    options = {
        authorId: null, guildId: null, channelId: null, minId: null, maxId: null,
        content: null, hasLink: null, hasFile: null, includeNsfw: null, includeServers: null,
        includePinned: null, pattern: null, searchDelay: 1400, deleteDelay: 1400,
        rateLimitPrevention: true, maxAttempt: 2, askForConfirmation: true,
    };
    state = { /* ... same as original ... */
        running: false, delCount: 0, failCount: 0, grandTotal: 0, offset: {'asc': 0, 'desc': 0},
        iterations: 0, sortOrder: 'asc', searchedPages: 0, totalSkippedMessages: 0, startEmptyPages: -1,
        _seachResponse: null, _messagesToDelete: [], _skippedMessages: [],
    };
    stats = { /* ... same as original ... */
        startTime: new Date(), throttledCount: 0, throttledTotalTime: 0, lastPing: null, avgPing: null, etr: 0,
    };

    onStart = undefined;
    onProgress = undefined;
    onStop = undefined;

    resetState() { /* ... same as original ... */
        this.state = {
            running: false, delCount: 0, failCount: 0, grandTotal: 0, offset: {'asc': 0, 'desc': 0},
            iterations: 0, sortOrder: 'asc', searchedPages: 0, totalSkippedMessages: 0, startEmptyPages: -1,
            _seachResponse: null, _messagesToDelete: [], _skippedMessages: [],
        };
        this.options.askForConfirmation = true;
    }

    async runBatch(queue) { /* ... same as original, uses undiscordInternalLog ... */
        if (this.state.running) return undiscordInternalLog.error('Already running!');
        undiscordInternalLog.info(`Runnning batch with queue of ${queue.length} jobs`);
        for (let i = 0; i < queue.length; i++) {
            const job = queue[i];
            undiscordInternalLog.info('Starting job...', `(${i + 1}/${queue.length})`);
            this.options = { ...this.options, ...job };
            await this.run(true);
            if (!this.state.running) break;
            undiscordInternalLog.info('Job ended.', `(${i + 1}/${queue.length})`);
            this.resetState();
            this.options.askForConfirmation = false;
            this.state.running = true;
        }
        undiscordInternalLog.info('Batch finished.');
        this.state.running = false;
    }

    async run(isJob = false) { /* ... same as original, uses undiscordInternalLog, ask, wait ... */
        if (this.state.running && !isJob) return undiscordInternalLog.error('Already running!');
        this.state.running = true;
        this.stats.startTime = new Date();
        undiscordInternalLog.success(`\nStarted at ${this.stats.startTime.toLocaleString()}`);
        if (this.onStart) this.onStart(this.state, this.stats);

        if (!this.options.guildId) {
            undiscordInternalLog.verb('Fetching channel info...');
            await this.fetchChannelInfo();
        }
        if (!this.options.guildId && this.state.running) { // check running in case fetchChannelInfo stopped it
            undiscordInternalLog.error("Could not determine Guild ID. Stopping.");
            this.stop();
            return;
        }
        if (isJob && this.options.guildId !== '@me' && !this.options.includeServers) {
            undiscordInternalLog.warn(`Skipping the channel ${this.options.channelId} as it's a server channel.`);
            return;
        }

        undiscordInternalLog.debug(
            `authorId = "${redact(this.options.authorId)}"`, `guildId = "${redact(this.options.guildId)}"`,
            `channelId = "${redact(this.options.channelId)}"`, `minId = "${redact(this.options.minId)}"`,
            `maxId = "${redact(this.options.maxId)}"`, `hasLink = ${!!this.options.hasLink}`, `hasFile = ${!!this.options.hasFile}`,
        );

        do {
            this.state.iterations++;
            undiscordInternalLog.verb('Fetching messages...');
            this.state.sortOrder = this.state.sortOrder == 'desc' ? 'asc' : 'desc';
            undiscordInternalLog.verb(`Set sort order to ${this.state.sortOrder} for this search.`);
            await this.search();
            if (!this.state.running) break; // Search might have failed and stopped
            this.state.searchedPages++;

            await this.filterResponse();
            undiscordInternalLog.verb(
                `Grand total: ${this.state.grandTotal}`, `(Messages in current page: ${this.state._seachResponse.messages.length}`,
                `To be deleted: ${this.state._messagesToDelete.length}`, `Skipped: ${this.state._skippedMessages.length})`,
                `offset (asc): ${this.state.offset['asc']}`, `offset (desc): ${this.state.offset['desc']}`
            );
            this.printStats();
            this.state.totalSkippedMessages += this.state._skippedMessages.length;
            this.calcEtr();
            undiscordInternalLog.verb(`Estimated time remaining: ${msToHMS(this.stats.etr)}`);

            if (this.state._messagesToDelete.length > 0) {
                this.state.startEmptyPages = -1;
                if (await this.confirm() === false) {
                    this.state.running = false; break;
                }
                await this.deleteMessagesFromList();
            } else if (this.state._skippedMessages.length > 0) {
                this.state.startEmptyPages = -1;
                const oldOffset = this.state.offset[this.state.sortOrder];
                this.state.offset[this.state.sortOrder] += this.state._skippedMessages.length;
                undiscordInternalLog.verb('There\'s nothing we can delete on this page, checking next page...');
                undiscordInternalLog.verb(`Skipped ${this.state._skippedMessages.length} out of ${this.state._seachResponse.messages.length} in this page.`, `(Offset for ${this.state.sortOrder} was ${oldOffset}, ajusted to ${this.state.offset[this.state.sortOrder]})`);
            } else {
                if (this.state.startEmptyPages == -1) this.state.startEmptyPages = Date.now();
                if (this.state.searchedPages == 1 || (Date.now() - this.state.startEmptyPages) > 30 * 1000 || (this.state.delCount + this.state.failCount + this.state.totalSkippedMessages) >= this.state.grandTotal) {
                    undiscordInternalLog.verb('Ended because API returned an empty page.');
                    undiscordInternalLog.verb('[End state]', this.state);
                    if (isJob) break;
                    this.state.running = false;
                } else {
                    const waitingTime = 10 * 1000;
                    undiscordInternalLog.verb(`API returned an empty page, waiting an extra ${(waitingTime / 1000).toFixed(2)}s before searching again...`);
                    await wait(waitingTime);
                }
            }
            if (!this.state.running) break;
            undiscordInternalLog.verb(`Waiting ${(this.options.searchDelay / 1000).toFixed(2)}s before next page...`);
            await wait(this.options.searchDelay);
        } while (this.state.running);

        this.stats.endTime = new Date();
        undiscordInternalLog.success(`Ended at ${this.stats.endTime.toLocaleString()}! Total time: ${msToHMS(this.stats.endTime.getTime() - this.stats.startTime.getTime())}`);
        this.printStats();
        undiscordInternalLog.debug(`Deleted ${this.state.delCount} messages, ${this.state.failCount} failed.\n`);
        if (this.onStop) this.onStop(this.state, this.stats);
    }

    stop() { /* ... same as original ... */
        this.state.running = false;
        if (this.onStop) this.onStop(this.state, this.stats);
    }
    calcEtr() { /* ... same as original ... */
        this.stats.etr = (this.options.searchDelay + this.stats.avgPing) * Math.round((this.state.grandTotal - this.state.delCount) / 25) + (this.options.deleteDelay + this.stats.avgPing) * (this.state.grandTotal - this.state.delCount);
    }
    async confirm() { /* ... same as original, uses undiscordInternalLog, ask ... */
        if (!this.options.askForConfirmation) return true;
        undiscordInternalLog.verb('Waiting for your confirmation...');
        const preview = this.state._messagesToDelete.map(m => `${m.author.username}#${m.author.discriminator}: ${m.attachments.length ? '[ATTACHMENTS]' : m.content}`).join('\n');
        const answer = await ask(
            `Do you want to delete ~${this.state.grandTotal} messages? (Estimated time: ${msToHMS(this.stats.etr)})` +
            '(The actual number of messages may be less, depending if you\'re using filters to skip some messages)' +
            '\n\n---- Preview ----\n' + preview
        );
        if (!answer) {
            undiscordInternalLog.error('Aborted by you!');
            return false;
        } else {
            undiscordInternalLog.verb('OK');
            this.options.askForConfirmation = false;
            return true;
        }
    }

    async fetchChannelInfo() {
        let resp;
        try {
            await this.beforeRequest();
            resp = await http.get({ url: `/channels/${this.options.channelId}` }); // Authorization header removed
            this.afterRequest();
        } catch (err) {
            this.state.running = false;
            undiscordInternalLog.error('Channel request threw an error:', err);
            return {};
        }

        if (resp.status === 202) {
            let w = (resp.body).retry_after;
            w = !isNaN(w) ? w * 1000 : this.options.searchDelay;
            this.stats.throttledCount++;
            this.stats.throttledTotalTime += w;
            undiscordInternalLog.warn(`This channel isn't indexed yet. Waiting ${w}ms for discord to index it...`);
            await wait(w);
            return await this.fetchChannelInfo();
        }

        if (!resp.ok) {
            if (resp.status === 429) {
                let w = (resp.body).retry_after;
                w = !isNaN(w) ? w * 1000 : this.options.searchDelay;
                this.stats.throttledCount++;
                this.stats.throttledTotalTime += w;
                undiscordInternalLog.warn(`Being rate limited by the API for ${w}ms!`);
                this.printStats();
                undiscordInternalLog.verb(`Cooling down for ${w * 2}ms before retrying...`);
                await wait(w * 2);
                return await this.fetchChannelInfo();
            } else {
                undiscordInternalLog.error(`Error fetching the channel, API responded with status ${resp.status}!\n`, resp.body);
                this.state.running = false;
                return {};
            }
        }
        const data = resp.body;
        this.options.guildId = data.guild_id ?? '@me';
        return data;
    }

    async search() {
        let API_SEARCH_URL;
        if (this.options.guildId === '@me') API_SEARCH_URL = `/channels/${this.options.channelId}/messages/`;
        else API_SEARCH_URL = `/guilds/${this.options.guildId}/messages/`;

        const queryParamsBase = [
            ['author_id', this.options.authorId || undefined],
            ['channel_id', (this.options.guildId !== '@me' ? this.options.channelId : undefined) || undefined],
            ['min_id', this.options.minId ? toSnowflake(this.options.minId) : undefined],
            ['max_id', this.options.maxId ? toSnowflake(this.options.maxId) : undefined],
            ['sort_by', 'timestamp'],
            ['sort_order', this.state.sortOrder],
            ['offset', this.state.offset[this.state.sortOrder]],
            ['content', this.options.content || undefined],
            ['include_nsfw', this.options.includeNsfw ? true : undefined],
        ];
        if(this.options.hasLink) queryParamsBase.push(['has', 'link']);
        if(this.options.hasFile) queryParamsBase.push(['has', 'file']);
        const finalQuery = queryString(queryParamsBase);

        let resp;
        try {
            await this.beforeRequest();
            resp = await http.get({ url: `${API_SEARCH_URL}search?${finalQuery}` }); // Authorization header removed
            this.afterRequest();
        } catch (err) {
            this.state.running = false;
            undiscordInternalLog.error('Search request threw an error:', err);
            this.state._seachResponse = { messages: [], total_results: 0 };
            return this.state._seachResponse;
        }

        if (resp.status === 202) {
            let w = (resp.body).retry_after;
            w = !isNaN(w) ? w * 1000 : this.options.searchDelay;
            this.stats.throttledCount++;
            this.stats.throttledTotalTime += w;
            undiscordInternalLog.warn(`This channel isn't indexed yet. Waiting ${w}ms for discord to index it...`);
            await wait(w);
            return await this.search();
        }

        if (!resp.ok) {
            if (resp.status === 429) {
                let w = (resp.body).retry_after;
                w = !isNaN(w) ? w * 1000 : this.options.searchDelay;
                this.stats.throttledCount++;
                this.stats.throttledTotalTime += w;
                undiscordInternalLog.warn(`Being rate limited by the API for ${w}ms!`);
                this.printStats();
                undiscordInternalLog.verb(`Cooling down for ${w * 2}ms before retrying...`);
                await wait(w * 2);
                return await this.search();
            } else {
                undiscordInternalLog.error(`Error searching messages, API responded with status ${resp.status}!\n`, resp.body);
                this.state._seachResponse = { messages: [], total_results: 0 };
                this.state.running = false;
                return this.state._seachResponse;
            }
        }
        const data = resp.body;
        data.messages = data.messages || [];
        data.total_results = data.total_results || 0;
        this.state._seachResponse = data;
        undiscordInternalLog.debug(USER_SCRIPT_PREFIX, 'search', data);
        return data;
    }

    async filterResponse() { /* ... same as original, uses undiscordInternalLog ... */
        const data = this.state._seachResponse;
        if (!data || !data.messages) { // Guard against undefined data
            undiscordInternalLog.error("FilterResponse: _seachResponse or messages is undefined.", data);
            this.state._messagesToDelete = [];
            this.state._skippedMessages = [];
            return;
        }

        const total = data.total_results;
        if (total > this.state.grandTotal) this.state.grandTotal = total;

        const discoveredMessages = data.messages.map(convo => convo.find(message => message.hit === true)).filter(Boolean); // filter(Boolean) to remove undefineds
        let messagesToDelete = discoveredMessages;
        messagesToDelete = messagesToDelete.filter(msg => msg.type === 0 || (msg.type >= 6 && msg.type <= 21));
        messagesToDelete = messagesToDelete.filter(msg => msg.pinned ? this.options.includePinned : true);
        try {
            if (this.options.pattern) { // Only apply regex if pattern is not empty
                const regex = new RegExp(this.options.pattern, 'i');
                messagesToDelete = messagesToDelete.filter(msg => regex.test(msg.content));
            }
        } catch (e) {
            undiscordInternalLog.warn('Ignoring RegExp because pattern is malformed!', e);
        }
        const skippedMessages = discoveredMessages.filter(msg => !messagesToDelete.find(m => m.id === msg.id));
        this.state._messagesToDelete = messagesToDelete;
        this.state._skippedMessages = skippedMessages;
        undiscordInternalLog.debug(USER_SCRIPT_PREFIX, 'filterResponse', this.state);
    }

    async deleteMessagesFromList() { /* ... same as original, uses undiscordInternalLog, wait ... */
        for (let i = 0; i < this.state._messagesToDelete.length; i++) {
            const message = this.state._messagesToDelete[i];
            if (!this.state.running) return undiscordInternalLog.error('Stopped by you!');
            undiscordInternalLog.debug(
                `[${this.state.delCount + 1}/${this.state.grandTotal}] ` +
                `<sup>${new Date(message.timestamp).toLocaleString()}</sup> ` +
                `<b>${redact(message.author.username + '#' + message.author.discriminator)}</b>` +
                `: <i>${redact(message.content).replace(/\n/g, '↵')}</i>` +
                (message.attachments.length ? redact(JSON.stringify(message.attachments)) : ''),
                `<sup>{ID:${redact(message.id)}}</sup>`
            );
            let attempt = 0;
            while (attempt < this.options.maxAttempt) {
                const result = await this.deleteMessage(message);
                if (result === 'RETRY') {
                    attempt++;
                    undiscordInternalLog.verb(`Retrying in ${this.options.deleteDelay}ms... (${attempt}/${this.options.maxAttempt})`);
                    await wait(this.options.deleteDelay);
                } else break;
            }
            this.calcEtr();
            if (this.onProgress) this.onProgress(this.state, this.stats);
            await wait(this.options.deleteDelay);
        }
    }

    async deleteMessage(message) {
        const API_DELETE_URL = `/channels/${message.channel_id}/messages/${message.id}`;
        let resp;
        try {
            await this.beforeRequest();
            resp = await http.del({ url: API_DELETE_URL }); // Authorization header removed
            this.afterRequest();
        } catch (err) {
            undiscordInternalLog.error('Delete request throwed an error:', err);
            undiscordInternalLog.verb('Related object:', redact(JSON.stringify(message)));
            this.state.failCount++;
            return 'FAILED';
        }

        if (!resp.ok) {
            if (resp.status === 429) {
                let w = (resp.body).retry_after;
                w = !isNaN(w) ? w * 1000 : this.options.deleteDelay;
                this.stats.throttledCount++;
                this.stats.throttledTotalTime += w;
                undiscordInternalLog.warn(`Being rate limited by the API for ${w}ms!`);
                this.printStats();
                undiscordInternalLog.verb(`Cooling down for ${w * 2}ms before retrying...`);
                await wait(w * 2);
                return 'RETRY';
            } else {
                let errorBody = resp.body; let parsedError;
                if (typeof errorBody === 'string') { try { parsedError = JSON.parse(errorBody); } catch (e) { /* not json */ } }
                else { parsedError = errorBody; }
                if (parsedError && resp.status === 400 && parsedError.code === 50083) {
                    undiscordInternalLog.warn('Error deleting message (Thread is archived). Will increment offset so we don\'t search this in the next page...');
                    this.state.offset[this.state.sortOrder]++;
                    this.state.failCount++;
                    return 'FAIL_SKIP';
                }
                undiscordInternalLog.error(`Error deleting message, API responded with status ${resp.status}!`, parsedError || errorBody);
                undiscordInternalLog.verb('Related object:', redact(JSON.stringify(message)));
                this.state.failCount++;
                return 'FAILED';
            }
        }
        this.state.delCount++;
        return 'OK';
    }

    #beforeTs = 0;
    #requestLog = [];
    async beforeRequest() { /* ... same as original ... */
        this.#requestLog.push(Date.now());
        this.#requestLog = this.#requestLog.filter(timestamp => (Date.now() - timestamp) < 60 * 1000);
        if (this.options.rateLimitPrevention) {
            let rateLimits = [[45, 60], [4, 5]];
            for (let [maxRequests, timePeriod] of rateLimits) {
                if (this.#requestLog.length >= maxRequests && (Date.now() - this.#requestLog[this.#requestLog.length - maxRequests]) < timePeriod * 1000) {
                    let delay = timePeriod * 1000 - (Date.now() - this.#requestLog[this.#requestLog.length - maxRequests]);
                    delay = delay * 1.15 + 300;
                    undiscordInternalLog.verb(`Delaying for an extra ${(delay / 1000).toFixed(2)}s to avoid rate limits...`);
                    await new Promise(resolve => setTimeout(resolve, delay)); // Use simple setTimeout here, wait() uses worker
                    break;
                }
            }
        }
        this.#beforeTs = Date.now();
    }
    afterRequest() { /* ... same as original ... */
        this.stats.lastPing = (Date.now() - this.#beforeTs);
        this.stats.avgPing = this.stats.avgPing > 0 ? (this.stats.avgPing * 0.9) + (this.stats.lastPing * 0.1) : this.stats.lastPing;
    }
    printStats() { /* ... same as original, uses undiscordInternalLog ... */
        undiscordInternalLog.verb(
            `Delete delay: ${this.options.deleteDelay}ms, Search delay: ${this.options.searchDelay}ms`,
            `Last Ping: ${this.stats.lastPing}ms, Average Ping: ${this.stats.avgPing | 0}ms`,
        );
        undiscordInternalLog.verb(
            `Rate Limited: ${this.stats.throttledCount} times.`,
            `Total time throttled: ${msToHMS(this.stats.throttledTotalTime)}.`
        );
    }
}

// --- DragResize and Draggable (unchanged, self-contained) ---
const MOVE = 0; /* ... rest of DragResize and Draggable classes ... */
const RESIZE_T = 1;
const RESIZE_B = 2;
const RESIZE_L = 4;
const RESIZE_R = 8;
const RESIZE_TL = RESIZE_T + RESIZE_L;
const RESIZE_TR = RESIZE_T + RESIZE_R;
const RESIZE_BL = RESIZE_B + RESIZE_L;
const RESIZE_BR = RESIZE_B + RESIZE_R;
class DragResize {
    constructor({ elm, moveHandle, options }) {
        this.options = defaultArgs({
            enabledDrag: true, enabledResize: true, minWidth: 200, maxWidth: Infinity, minHeight: 100,
            maxHeight: Infinity, dragAllowX: true, dragAllowY: true, resizeAllowX: true, resizeAllowY: true,
            draggingClass: 'drag', useMouseEvents: true, useTouchEvents: true, createHandlers: true,
        }, options);
        Object.assign(this, options); // options variable is not defined here. Should be this.options?
        // This seems like a bug in original, but it doesn't break if options is undefined.
        // Let's keep as is from original.

        elm.style.position = 'fixed';
        this.drag_m = new Draggable(elm, moveHandle, MOVE, this.options);
        if (this.options.createHandlers) {
            this.el_t = createElement('div', { name: 'grab-t' }, elm); this.drag_t = new Draggable(elm, this.el_t, RESIZE_T, this.options);
            this.el_r = createElement('div', { name: 'grab-r' }, elm); this.drag_r = new Draggable(elm, this.el_r, RESIZE_R, this.options);
            this.el_b = createElement('div', { name: 'grab-b' }, elm); this.drag_b = new Draggable(elm, this.el_b, RESIZE_B, this.options);
            this.el_l = createElement('div', { name: 'grab-l' }, elm); this.drag_l = new Draggable(elm, this.el_l, RESIZE_L, this.options);
            this.el_tl = createElement('div', { name: 'grab-tl' }, elm); this.drag_tl = new Draggable(elm, this.el_tl, RESIZE_TL, this.options);
            this.el_tr = createElement('div', { name: 'grab-tr' }, elm); this.drag_tr = new Draggable(elm, this.el_tr, RESIZE_TR, this.options);
            this.el_br = createElement('div', { name: 'grab-br' }, elm); this.drag_br = new Draggable(elm, this.el_br, RESIZE_BR, this.options);
            this.el_bl = createElement('div', { name: 'grab-bl' }, elm); this.drag_bl = new Draggable(elm, this.el_bl, RESIZE_BL, this.options);
        }
    }
}
class Draggable {
    constructor(targetElm, handleElm, op, options) {
        Object.assign(this, options);
        this._targetElm = targetElm; this._handleElm = handleElm;
        let vw = window.innerWidth; let vh = window.innerHeight;
        let initialX, initialY, initialT, initialL, initialW, initialH;
        const clamp = (value, min, max) => value < min ? min : value > max ? max : value;
        const moveOp = (x, y) => {
            const deltaX = (x - initialX); const deltaY = (y - initialY);
            const t = clamp(initialT + deltaY, 0, vh - initialH); const l = clamp(initialL + deltaX, 0, vw - initialW);
            this._targetElm.style.top = t + 'px'; this._targetElm.style.left = l + 'px';
        };
        const resizeOp = (x, y) => {
            x = clamp(x, 0, vw); y = clamp(y, 0, vh);
            const deltaX = (x - initialX); const deltaY = (y - initialY);
            const resizeDirX = (op & RESIZE_L) ? -1 : 1; const resizeDirY = (op & RESIZE_T) ? -1 : 1;
            const deltaXMax = (this.maxWidth - initialW); const deltaXMin = (this.minWidth - initialW);
            const deltaYMax = (this.maxHeight - initialH); const deltaYMin = (this.minHeight - initialH);
            const t = initialT + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax) * resizeDirY;
            const l = initialL + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax) * resizeDirX;
            const w = initialW + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax);
            const h = initialH + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax);
            if (op & RESIZE_T) { this._targetElm.style.top = t + 'px'; this._targetElm.style.height = h + 'px'; }
            if (op & RESIZE_B) { this._targetElm.style.height = h + 'px'; }
            if (op & RESIZE_L) { this._targetElm.style.left = l + 'px'; this._targetElm.style.width = w + 'px'; }
            if (op & RESIZE_R) { this._targetElm.style.width = w + 'px'; }
        };
        let operation = op === MOVE ? moveOp : resizeOp;
        function dragStartHandler(e) {
            const touch = e.type === 'touchstart';
            if ((e.buttons === 1 || e.which === 1) || touch) {
                e.preventDefault(); const x = touch ? e.touches[0].clientX : e.clientX; const y = touch ? e.touches[0].clientY : e.clientY;
                initialX = x; initialY = y; vw = window.innerWidth; vh = window.innerHeight;
                initialT = this._targetElm.offsetTop; initialL = this._targetElm.offsetLeft;
                initialW = this._targetElm.clientWidth; initialH = this._targetElm.clientHeight;
                if (this.useMouseEvents) { document.addEventListener('mousemove', this._dragMoveHandler); document.addEventListener('mouseup', this._dragEndHandler); }
                if (this.useTouchEvents) { document.addEventListener('touchmove', this._dragMoveHandler, { passive: false }); document.addEventListener('touchend', this._dragEndHandler); }
                this._targetElm.classList.add(this.draggingClass);
            }
        }
        function dragMoveHandler(e) {
            e.preventDefault(); let x, y; const touch = e.type === 'touchmove';
            if (touch) { const t = e.touches[0]; x = t.clientX; y = t.clientY; }
            else { if ((e.buttons || e.which) !== 1) { this._dragEndHandler(); return; } x = e.clientX; y = e.clientY; }
            operation(x, y);
        }
        function dragEndHandler(e) {
            if (this.useMouseEvents) { document.removeEventListener('mousemove', this._dragMoveHandler); document.removeEventListener('mouseup', this._dragEndHandler); }
            if (this.useTouchEvents) { document.removeEventListener('touchmove', this._dragMoveHandler); document.removeEventListener('touchend', this._dragEndHandler); }
            this._targetElm.classList.remove(this.draggingClass);
        }
        this._dragStartHandler = dragStartHandler.bind(this); this._dragMoveHandler = dragMoveHandler.bind(this); this._dragEndHandler = dragEndHandler.bind(this);
        this.enable();
    }
    enable() { this.destroy(); if (this.useMouseEvents) this._handleElm.addEventListener('mousedown', this._dragStartHandler); if (this.useTouchEvents) this._handleElm.addEventListener('touchstart', this._dragStartHandler, { passive: false }); }
    destroy() { this._targetElm.classList.remove(this.draggingClass); if (this.useMouseEvents) { this._handleElm.removeEventListener('mousedown', this._dragStartHandler); document.removeEventListener('mousemove', this._dragMoveHandler); document.removeEventListener('mouseup', this._dragEndHandler); } if (this.useTouchEvents) { this._handleElm.removeEventListener('touchstart', this._dragStartHandler); document.removeEventListener('touchmove', this._dragMoveHandler); document.removeEventListener('touchend', this._dragEndHandler); } }
}
function createElement(tag='div', attrs, parent) { const elm = document.createElement(tag); if (attrs) Object.entries(attrs).forEach(([k, v]) => elm.setAttribute(k, v)); if (parent) parent.appendChild(elm); return elm; }
function defaultArgs(defaults, options) { function isObj(x) { return x !== null && typeof x === 'object'; } function hasOwn(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); } if (isObj(options)) for (let prop in defaults) { if (hasOwn(defaults, prop) && hasOwn(options, prop) && options[prop] !== undefined) { if (isObj(defaults[prop])) defaultArgs(defaults[prop], options[prop]); else defaults[prop] = options[prop]; } } return defaults; }
function createElm(html) { const temp = document.createElement('div'); temp.innerHTML = html; return temp.removeChild(temp.firstElementChild); }
// No `insertCss` needed here, will use shelter.ui.injectCss


// --- Message Picker (self-contained, but CSS injection handled by plugin) ---
const messagePickerCss = `
body.undiscord-pick-message [data-list-id="chat-messages"] { /* ... same as original ... */
  background-color: var(--background-secondary-alt);
  box-shadow: inset 0 0 0px 2px var(--button-outline-brand-border);
}
body.undiscord-pick-message [id^="message-content-"]:hover { cursor: pointer; cursor: cell; background: var(--background-message-automod-hover); }
body.undiscord-pick-message [id^="message-content-"]:hover::after { position: absolute; top: calc(50% - 11px); left: 4px; z-index: 1; width: 65px; height: 22px; line-height: 22px; font-family: var(--font-display); background-color: var(--button-secondary-background); color: var(--header-secondary); font-size: 12px; font-weight: 500; text-transform: uppercase; text-align: center; border-radius: 3px; content: 'This 👉'; }
body.undiscord-pick-message.before [id^="message-content-"]:hover::after { content: 'Before 👆'; }
body.undiscord-pick-message.after [id^="message-content-"]:hover::after { content: 'After 👇'; }
`;
const messagePicker = {
    // init() removed, CSS injected by plugin's onLoad
    grab(auxiliary) {
        return new Promise((resolve, reject) => {
            document.body.classList.add('undiscord-pick-message');
            if (auxiliary) document.body.classList.add(auxiliary);
            function clickHandler(e) {
                const message = e.target.closest('[id^="message-content-"]');
                if (message) {
                    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                    if (auxiliary) document.body.classList.remove(auxiliary);
                    document.body.classList.remove('undiscord-pick-message');
                    document.removeEventListener('click', clickHandler, true); // Use capture phase for removal
                    try { resolve(message.id.match(/message-content-(\d+)/)[1]); }
                    catch (e) { resolve(null); }
                }
            }
            document.addEventListener('click', clickHandler, true); // Use capture phase
        });
    }
};


// --- Shelter-adapted ID/Token getters ---
async function getAuthorIdInternal() {
    try {
        const userStore = await flux.awaitStore("UserStore");
        return userStore.getCurrentUser().id;
    } catch (e) {
        undiscordInternalLog.error("Failed to get current user ID from UserStore, trying localStorage", e);
        // Fallback to LS method from userscript if really needed
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        let authorIdFromLS = null;
        try {
            const LS = iframe.contentWindow.localStorage;
            authorIdFromLS = JSON.parse(LS.user_id_cache);
        } catch (lsErr) {
            undiscordInternalLog.warn("Failed to get authorId from localStorage via iframe", lsErr);
        } finally {
            iframe.remove();
        }
        if (!authorIdFromLS) undiscordInternalLog.error("Completely failed to get Author ID.");
        return authorIdFromLS;
    }
}

async function getGuildIdInternal() {
    try {
        const guildStore = await flux.awaitStore("SelectedGuildStore");
        return guildStore.getGuildId() || "@me";
    } catch (e) {
        undiscordInternalLog.error("Failed to get guild ID from SelectedGuildStore, trying URL", e);
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) return m[1];
        undiscordInternalLog.error("Completely failed to get Guild ID.");
        return null;
    }
}

async function getChannelIdInternal() {
    try {
        const channelStore = await flux.awaitStore("SelectedChannelStore");
        return channelStore.getChannelId();
    } catch (e) {
        undiscordInternalLog.error("Failed to get channel ID from SelectedChannelStore, trying URL", e);
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) return m[2];
        undiscordInternalLog.error("Completely failed to get Channel ID.");
        return null;
    }
}


// --- UI Globals and Functions ---
const undiscordCore = new UndiscordCore();
const ui = {
    undiscordWindow: null, undiscordBtn: null, logArea: null, autoScroll: null, trimLog: null,
    progressMain: null, progressIcon: null, percent: null,
};
const $ = s => ui.undiscordWindow.querySelector(s); // Needs ui.undiscordWindow to be set

let domObserver = null; // For the button re-mount observer

function initUI() {
    // CSS is injected in onLoad

    // create undiscord window
    const undiscordHtml = replaceInterpolations(undiscordTemplate, {
        VERSION: USER_SCRIPT_VERSION, HOME, WIKI,
    });
    ui.undiscordWindow = createElm(undiscordHtml);
    document.body.appendChild(ui.undiscordWindow);
    new DragResize({ elm: ui.undiscordWindow, moveHandle: $('.header') });

    // create undiscord Trash icon
    ui.undiscordBtn = createElm(buttonHtml);
    ui.undiscordBtn.onclick = toggleWindow;

    function mountBtn() {
        const toolbar = document.querySelector('#app-mount [class^=toolbar]'); // Standard Discord toolbar selector
        if (toolbar && !toolbar.contains(ui.undiscordBtn)) { // Check if not already mounted
            toolbar.appendChild(ui.undiscordBtn);
        } else if (!toolbar) {
            undiscordInternalLog.warn("Could not find toolbar to mount Undiscord button.");
        }
    }
    mountBtn(); // Initial attempt

    // Use Shelter's observeDom for re-mounting, managed by plugin.scoped
    // This specific observer is tricky because it observes #app-mount for toolbar changes.
    // The original MutationObserver is fine if managed properly.
    const discordElm = document.querySelector('#app-mount');
    if (discordElm) {
        domObserver = new MutationObserver(() => {
            if (!discordElm.contains(ui.undiscordBtn)) mountBtn();
        });
        domObserver.observe(discordElm, { childList: true, subtree: true });
    }


    function toggleWindow() {
        if (ui.undiscordWindow.style.display !== 'none') {
            ui.undiscordWindow.style.display = 'none';
            ui.undiscordBtn.style.color = 'var(--interactive-normal)';
        } else {
            ui.undiscordWindow.style.display = '';
            ui.undiscordBtn.style.color = 'var(--interactive-active)';
        }
    }

    ui.logArea = $('#logArea'); ui.autoScroll = $('#autoScroll'); ui.trimLog = $('#trimLog');
    ui.progressMain = $('#progressBar'); ui.progressIcon = ui.undiscordBtn.querySelector('progress');
    ui.percent = $('#progressPercent');

    $('#hide').onclick = toggleWindow;
    $('#toggleSidebar').onclick = ()=> ui.undiscordWindow.classList.toggle('hide-sidebar');
    $('button#start').onclick = startAction; // startAction is async
    $('button#stop').onclick = stopAction;
    $('button#clear').onclick = () => ui.logArea.innerHTML = '';

    $('button#getAuthor').onclick = async () => { const val = await getAuthorIdInternal(); if(val) $('input#authorId').value = val; };
    $('button#getGuild').onclick = async () => {
        const guildId = await getGuildIdInternal();
        if (guildId) $('input#guildId').value = guildId;
        if (guildId === '@me') { const channelId = await getChannelIdInternal(); if(channelId) $('input#channelId').value = channelId; }
    };
    $('button#getChannel').onclick = async () => {
        const channelId = await getChannelIdInternal(); if(channelId) $('input#channelId').value = channelId;
        const guildId = await getGuildIdInternal(); if(guildId) $('input#guildId').value = guildId;
    };
    $('#redact').onchange = () => {
        const b = ui.undiscordWindow.classList.toggle('redact');
        if (b) alert('This mode will attempt to hide personal information, so you can screen share / take screenshots.\nAlways double check you are not sharing sensitive information!');
    };
    $('#pickMessageAfter').onclick = async () => {
        alert('Select a message on the chat.\nThe message below it will be deleted.');
        toggleWindow(); const id = await messagePicker.grab('after');
        if (id) $('input#minId').value = id;
        toggleWindow();
    };
    $('#pickMessageBefore').onclick = async () => {
        alert('Select a message on the chat.\nThe message above it will be deleted.');
        toggleWindow(); const id = await messagePicker.grab('before');
        if (id) $('input#maxId').value = id;
        toggleWindow();
    };

    $('input#searchDelay').onchange = (e) => { const v = parseInt(e.target.value); if (v) undiscordCore.options.searchDelay = v; };
    $('input#searchDelay').oninput = (e) => $('div#searchDelayValue').textContent = e.target.value + 'ms';
    $('input#deleteDelay').onchange = (e) => { const v = parseInt(e.target.value); if (v) undiscordCore.options.deleteDelay = v; };
    $('input#deleteDelay').oninput = (e) => $('div#deleteDelayValue').textContent = e.target.value + 'ms';
    $('input#rateLimitPrevention').onchange = (e) => { undiscordCore.options.rateLimitPrevention = e.target.checked ?? false; };

    // Set initial delay values in UI
    $('div#searchDelayValue').textContent = $('input#searchDelay').value + 'ms';
    $('div#deleteDelayValue').textContent = $('input#deleteDelay').value + 'ms';


    const fileSelection = $('input#importJsonInput');
    fileSelection.onchange = async () => {
        const files = fileSelection.files;
        if (files.length === 0) return undiscordInternalLog.warn('No file selected.');
        const channelIdField = $('input#channelId'); const guildIdField = $('input#guildId');
        guildIdField.value = 'null'; // This is a specific value the script uses for archive mode
        const authorVal = await getAuthorIdInternal(); if(authorVal) $('input#authorId').value = authorVal; // Set author if not set
        try {
            const file = files[0]; const text = await file.text(); const json = JSON.parse(text);
            const channelIds = Object.keys(json); channelIdField.value = channelIds.join(',');
            undiscordInternalLog.info(`Loaded ${channelIds.length} channels from archive index.`);
        } catch(err) { undiscordInternalLog.error('Error parsing file!', err); }
    };

    setUndiscordInternalLogFn(printLog); // Redirect internal logs to UI
    setupUndiscordCore();
}

function printLog(type = '', args) { /* ... same as original, uses ui ... */
    ui.logArea.insertAdjacentHTML('beforeend', `<div class="log log-${type}">${Array.from(args).map(o => typeof o === 'object' ? JSON.stringify(o, o instanceof Error && Object.getOwnPropertyNames(o)) : o).join('\t')}</div>`);
    if (ui.trimLog.checked) {
        const maxLogEntries = 500; const logEntries = ui.logArea.querySelectorAll('.log');
        if (logEntries.length > maxLogEntries) { for (let i = 0; i < (logEntries.length - maxLogEntries); i++) logEntries[i].remove(); }
    }
    if (ui.autoScroll.checked) ui.logArea.querySelector('div:last-child').scrollIntoView(false);
    if (type==='error') console.error(USER_SCRIPT_PREFIX, ...Array.from(args)); // Also log errors to actual console
}

function setupUndiscordCore() { /* ... same as original, uses ui, $, msToHMS ... */
    undiscordCore.onStart = (state, stats) => {
        shelterLog([USER_SCRIPT_PREFIX, 'onStart:', state, stats]);
        $('button#start').disabled = true; $('button#stop').disabled = false;
        ui.undiscordBtn.classList.add('running'); ui.progressMain.style.display = 'block'; ui.percent.style.display = 'block';
    };
    undiscordCore.onProgress = (state, stats) => {
        let max = state.grandTotal; const value = state.delCount + state.failCount; max = Math.max(max, value, 0);
        const percent = value >= 0 && max ? Math.round(value / max * 100) + '%' : '';
        const elapsed = msToHMS(Date.now() - stats.startTime.getTime()); const remaining = msToHMS(stats.etr);
        ui.percent.innerHTML = `${percent} (${value}/${max}) Elapsed: ${elapsed} Remaining: ${remaining}`;
        ui.progressIcon.value = value; ui.progressMain.value = value;
        if (max) { ui.progressIcon.setAttribute('max', max); ui.progressMain.setAttribute('max', max); }
        else { ui.progressIcon.removeAttribute('value'); ui.progressMain.removeAttribute('value'); ui.percent.innerHTML = '...'; }

        const searchDelayInput = $('input#searchDelay'); searchDelayInput.value = undiscordCore.options.searchDelay;
        $('div#searchDelayValue').textContent = undiscordCore.options.searchDelay+'ms';
        const deleteDelayInput = $('input#deleteDelay'); deleteDelayInput.value = undiscordCore.options.deleteDelay;
        $('div#deleteDelayValue').textContent = undiscordCore.options.deleteDelay+'ms';
    };
    undiscordCore.onStop = (state, stats) => {
        shelterLog([USER_SCRIPT_PREFIX, 'onStop:', state, stats]);
        $('button#start').disabled = false; $('button#stop').disabled = true;
        ui.undiscordBtn.classList.remove('running'); ui.progressMain.style.display = 'none'; ui.percent.style.display = 'none';
    };
}

async function startAction() {
    shelterLog([USER_SCRIPT_PREFIX, 'startAction']); // Corrected
    const authorId = $('input#authorId').value.trim();
    const guildId = $('input#guildId').value.trim();
    const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/);
    const includeNsfw = $('input#includeNsfw').checked;
    const includeServers = $('input#includeServers').checked;
    const content = $('input#search').value.trim();
    const hasLink = $('input#hasLink').checked; const hasFile = $('input#hasFile').checked;
    const includePinned = $('input#includePinned').checked; const pattern = $('input#pattern').value;
    const minId = $('input#minId').value.trim(); const maxId = $('input#maxId').value.trim();
    const minDate = $('input#minDate').value.trim(); const maxDate = $('input#maxDate').value.trim();
    const searchDelay = parseInt($('input#searchDelay').value.trim());
    const deleteDelay = parseInt($('input#deleteDelay').value.trim());
    const rateLimitPrevention = $('input#rateLimitPrevention').checked;

    // authToken acquisition removed

    if (!guildId && channelIds.join("").trim() === "") return undiscordInternalLog.error('You must fill the "Server ID" or "Channel ID" field!');
    if (guildId === 'null' && channelIds.join("").trim() === "") return undiscordInternalLog.error('For archive wipe, "Channel ID" field must be filled from imported JSON (or manually)!');

    ui.logArea.innerHTML = '';

    undiscordCore.resetState();
    undiscordCore.options = { // authToken removed from options
        ...undiscordCore.options, // This will not include authToken as it's removed from the class default
        authorId,
        guildId: guildId === 'null' ? null : guildId,
        channelId: channelIds.length === 1 ? channelIds[0] : undefined,
        minId: minId || minDate, maxId: maxId || maxDate,
        content, hasLink, hasFile, includeNsfw, includeServers, includePinned, pattern,
        searchDelay, deleteDelay, rateLimitPrevention,
    };

    if (channelIds.length > 1 || (guildId === 'null' && channelIds.length > 0 && channelIds[0].includes(','))) {
        const actualChannelIds = (guildId === 'null' && channelIds.length === 1) ? channelIds[0].split(/\s*,\s*/) : channelIds;
        const jobs = actualChannelIds.filter(id => id.trim() !== "").map(ch => ({
            guildId: guildId === 'null' ? null : guildId,
            channelId: ch.trim(),
        }));
        if (jobs.length === 0) {
            undiscordInternalLog.error("No valid channel IDs to process for batch operation.");
            return;
        }
        try { await undiscordCore.runBatch(jobs); }
        catch (err) { undiscordInternalLog.error('CoreException (batch)', err); }
    } else {
        try { await undiscordCore.run(); }
        catch (err) { undiscordInternalLog.error('CoreException (single)', err); undiscordCore.stop(); }
    }
}

function stopAction() { shelterLog([USER_SCRIPT_PREFIX, 'stopAction']); undiscordCore.stop(); }

// --- End of UserScript Code ---


export function onLoad() {
    shelterLog("Undiscord Plugin loading...");
    initializeWorker();

    // Inject CSS using plugin.scoped for automatic cleanup
    plugin.scoped.ui.injectCss(themeCss);
    plugin.scoped.ui.injectCss(mainCss);
    plugin.scoped.ui.injectCss(dragCss);
    plugin.scoped.ui.injectCss(messagePickerCss);

    initUI(); // This sets up the main UI elements and event listeners

    shelterLog("Undiscord Plugin loaded successfully!");
}

export function onUnload() {
    shelterLog("Undiscord Plugin unloading...");

    if (undiscordCore && undiscordCore.state.running) {
        undiscordCore.stop();
    }

    if (ui.undiscordBtn && ui.undiscordBtn.parentElement) {
        ui.undiscordBtn.remove();
    }
    if (ui.undiscordWindow && ui.undiscordWindow.parentElement) {
        ui.undiscordWindow.remove();
    }

    if (domObserver) {
        domObserver.disconnect();
        domObserver = null;
    }

    cleanupWorker();

    // CSS injected via plugin.scoped.injectCss is auto-cleaned.
    shelterLog("Undiscord Plugin unloaded.");
}