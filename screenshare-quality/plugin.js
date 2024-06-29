(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/screenshare-quality/index.jsx
  var screenshare_quality_exports = {};
  __export(screenshare_quality_exports, {
    onLoad: () => onLoad,
    onUnload: () => onUnload
  });
  var {
    util: {
      log
    },
    flux: {
      stores: {
        UserStore,
        MediaEngineStore
      },
      dispatcher
    }
  } = shelter;
  var resolutions = [480, 720, 1080, 1440];
  var framerates = [5, 15, 30, 60];
  var resolution = 720;
  var fps = 30;
  function patchScreenshareQuality(height, framerate) {
    resolution = roundToClosest(height, resolutions);
    fps = roundToClosest(framerate, framerates);
  }
  function onStreamQualityChange() {
    const mediaConnections = [...MediaEngineStore.getMediaEngine().connections];
    const currentUserId = UserStore.getCurrentUser().id;
    const streamConnection = mediaConnections.find((connection) => connection.streamUserId === currentUserId);
    if (streamConnection) {
      streamConnection.videoStreamParameters[0].maxFrameRate = fps;
      streamConnection.videoStreamParameters[0].maxResolution.height = resolution;
      streamConnection.videoStreamParameters[0].maxResolution.width = Math.round(resolution * (screen.width / screen.height));
      streamConnection.videoQualityManager.goliveMaxQuality.bitrateMin = 5e5;
      streamConnection.videoQualityManager.goliveMaxQuality.bitrateMax = 1e7;
      streamConnection.videoQualityManager.goliveMaxQuality.bitrateTarget = 6e5;
      log(`Patched current user stream with resolution: ${resolution} and fps: ${fps}`);
    }
  }
  function onLoad() {
    dispatcher.subscribe("MEDIA_ENGINE_VIDEO_SOURCE_QUALITY_CHANGED", onStreamQualityChange);
  }
  function onUnload() {
    dispatcher.unsubscribe("MEDIA_ENGINE_VIDEO_SOURCE_QUALITY_CHANGED", onStreamQualityChange);
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
  return __toCommonJS(screenshare_quality_exports);
})();
