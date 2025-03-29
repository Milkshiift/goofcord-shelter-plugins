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
    const calculatedTargetBitrate = Math.round(
        width * height * fps * 0.08, // width * height * fps * bits per pixel value
    );
    if (streamConnection) {
        streamConnection.videoStreamParameters[0].maxFrameRate = fps;
        streamConnection.videoStreamParameters[0].maxResolution.height = height;
        streamConnection.videoStreamParameters[0].maxResolution.width = width;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMin = calculatedTargetBitrate*0.95;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateMax = calculatedTargetBitrate*1.25;
        streamConnection.videoQualityManager.goliveMaxQuality.bitrateTarget = calculatedTargetBitrate;
        log(`Patched current user stream with resolution: ${height} FPS: ${fps} Target Bitrate: ${calculatedTargetBitrate}`);
    }
}
export function onLoad() {
    if (window.goofcord.version.split(".")[2] > 4) return;
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
