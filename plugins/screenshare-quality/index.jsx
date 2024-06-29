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
let resolution = 720;
let fps = 30;
function patchScreenshareQuality(height, framerate) {
    // Not rounding causes a crash
    resolution = roundToClosest(height, resolutions);
    fps = roundToClosest(framerate, framerates);
}

function onStreamQualityChange() {
    const mediaConnections = [...MediaEngineStore.getMediaEngine().connections];
    const currentUserId = UserStore.getCurrentUser().id;
    const streamConnection = mediaConnections.find(connection => connection.streamUserId === currentUserId);
    if (streamConnection) {
        streamConnection.videoStreamParameters[0].maxFrameRate = fps;
        streamConnection.videoStreamParameters[0].maxResolution.height = resolution;
        streamConnection.videoStreamParameters[0].maxResolution.width = Math.round(resolution * (screen.width / screen.height));
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMin = 500000;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMax = 10000000;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateTarget = 600000;
        log(`Patched current user stream with resolution: ${resolution} and fps: ${fps}`);
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
