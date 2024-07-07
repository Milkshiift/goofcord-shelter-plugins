// This code was partially yoinked from https://github.com/ArmCord/shelter-plugins

const {
    util: { log },
    flux: {
        stores: {
            UserStore,
            MediaEngineStore
        },
        dispatcher
    }
} = shelter;

const resolutions = [480, 720, 1080, 1440];
const framerates = [5, 15, 30, 60];
let height = 720;
let width = 1280;
let fps = 30;
function patchScreenshareQuality(newHeight, newFramerate) {
    // Not rounding causes a crash
    height = roundToClosest(newHeight, resolutions);
    width = Math.round(height * (screen.width / screen.height));
    fps = roundToClosest(newFramerate, framerates);
}

async function onStreamQualityChange() {
    const mediaConnections = [...MediaEngineStore.getMediaEngine().connections];
    const currentUserId = UserStore.getCurrentUser().id;
    const streamConnection = mediaConnections.find(connection => connection.streamUserId === currentUserId);
    if (streamConnection) {
        streamConnection.videoStreamParameters[0].maxFrameRate = fps;
        streamConnection.videoStreamParameters[0].maxResolution.height = height;
        streamConnection.videoStreamParameters[0].maxResolution.width = width;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMin = 500000;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMax = 8000000;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateTarget = 600000;
        log(`Patched current user stream with resolution: ${height} and fps: ${fps}`);
    }
}
export function onLoad() {
    dispatcher.subscribe("MEDIA_ENGINE_VIDEO_SOURCE_QUALITY_CHANGED", onStreamQualityChange)
}

export function onUnload() {
    dispatcher.unsubscribe("MEDIA_ENGINE_VIDEO_SOURCE_QUALITY_CHANGED", onStreamQualityChange)
}

function roundToClosest(input, array) {
    let closestValue = array[0];
    let smallestDifference = Math.abs(input - closestValue);
    for (let i = 1; i < array.length; i++) {
        let currentDifference = Math.abs(input - array[i]);
        if (currentDifference < smallestDifference) {
            closestValue = array[i];
            smallestDifference = currentDifference;
        }
    }
    return closestValue;
}

window.ScreenshareQuality = {};
window.ScreenshareQuality.patchScreenshareQuality = patchScreenshareQuality;
